package uasb.edu.web.rest;

import uasb.edu.BancoApp;
import uasb.edu.domain.Cuenta;
import uasb.edu.domain.Cliente;
import uasb.edu.repository.CuentaRepository;
import uasb.edu.service.CuentaService;
import uasb.edu.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static uasb.edu.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import uasb.edu.domain.enumeration.Moneda;
import uasb.edu.domain.enumeration.Estado;
/**
 * Integration tests for the {@link CuentaResource} REST controller.
 */
@SpringBootTest(classes = BancoApp.class)
public class CuentaResourceIT {

    private static final Long DEFAULT_NRO_CUENTA = 1L;
    private static final Long UPDATED_NRO_CUENTA = 2L;
    private static final Long SMALLER_NRO_CUENTA = 1L - 1L;

    private static final Instant DEFAULT_FECHA_APERTURA = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA_APERTURA = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_FECHA_APERTURA = Instant.ofEpochMilli(-1L);

    private static final Moneda DEFAULT_MONEDA = Moneda.BOB;
    private static final Moneda UPDATED_MONEDA = Moneda.USD;

    private static final Estado DEFAULT_ESTADO = Estado.Vigente;
    private static final Estado UPDATED_ESTADO = Estado.Suspendida;

    @Autowired
    private CuentaRepository cuentaRepository;

    @Autowired
    private CuentaService cuentaService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restCuentaMockMvc;

    private Cuenta cuenta;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CuentaResource cuentaResource = new CuentaResource(cuentaService);
        this.restCuentaMockMvc = MockMvcBuilders.standaloneSetup(cuentaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cuenta createEntity(EntityManager em) {
        Cuenta cuenta = new Cuenta()
            .nroCuenta(DEFAULT_NRO_CUENTA)
            .fechaApertura(DEFAULT_FECHA_APERTURA)
            .moneda(DEFAULT_MONEDA)
            .estado(DEFAULT_ESTADO);
        // Add required entity
        Cliente cliente;
        if (TestUtil.findAll(em, Cliente.class).isEmpty()) {
            cliente = ClienteResourceIT.createEntity(em);
            em.persist(cliente);
            em.flush();
        } else {
            cliente = TestUtil.findAll(em, Cliente.class).get(0);
        }
        cuenta.setCliente(cliente);
        return cuenta;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cuenta createUpdatedEntity(EntityManager em) {
        Cuenta cuenta = new Cuenta()
            .nroCuenta(UPDATED_NRO_CUENTA)
            .fechaApertura(UPDATED_FECHA_APERTURA)
            .moneda(UPDATED_MONEDA)
            .estado(UPDATED_ESTADO);
        // Add required entity
        Cliente cliente;
        if (TestUtil.findAll(em, Cliente.class).isEmpty()) {
            cliente = ClienteResourceIT.createUpdatedEntity(em);
            em.persist(cliente);
            em.flush();
        } else {
            cliente = TestUtil.findAll(em, Cliente.class).get(0);
        }
        cuenta.setCliente(cliente);
        return cuenta;
    }

    @BeforeEach
    public void initTest() {
        cuenta = createEntity(em);
    }

    @Test
    @Transactional
    public void createCuenta() throws Exception {
        int databaseSizeBeforeCreate = cuentaRepository.findAll().size();

        // Create the Cuenta
        restCuentaMockMvc.perform(post("/api/cuentas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cuenta)))
            .andExpect(status().isCreated());

        // Validate the Cuenta in the database
        List<Cuenta> cuentaList = cuentaRepository.findAll();
        assertThat(cuentaList).hasSize(databaseSizeBeforeCreate + 1);
        Cuenta testCuenta = cuentaList.get(cuentaList.size() - 1);
        assertThat(testCuenta.getNroCuenta()).isEqualTo(DEFAULT_NRO_CUENTA);
        assertThat(testCuenta.getFechaApertura()).isEqualTo(DEFAULT_FECHA_APERTURA);
        assertThat(testCuenta.getMoneda()).isEqualTo(DEFAULT_MONEDA);
        assertThat(testCuenta.getEstado()).isEqualTo(DEFAULT_ESTADO);
    }

    @Test
    @Transactional
    public void createCuentaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cuentaRepository.findAll().size();

        // Create the Cuenta with an existing ID
        cuenta.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCuentaMockMvc.perform(post("/api/cuentas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cuenta)))
            .andExpect(status().isBadRequest());

        // Validate the Cuenta in the database
        List<Cuenta> cuentaList = cuentaRepository.findAll();
        assertThat(cuentaList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNroCuentaIsRequired() throws Exception {
        int databaseSizeBeforeTest = cuentaRepository.findAll().size();
        // set the field null
        cuenta.setNroCuenta(null);

        // Create the Cuenta, which fails.

        restCuentaMockMvc.perform(post("/api/cuentas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cuenta)))
            .andExpect(status().isBadRequest());

        List<Cuenta> cuentaList = cuentaRepository.findAll();
        assertThat(cuentaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCuentas() throws Exception {
        // Initialize the database
        cuentaRepository.saveAndFlush(cuenta);

        // Get all the cuentaList
        restCuentaMockMvc.perform(get("/api/cuentas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cuenta.getId().intValue())))
            .andExpect(jsonPath("$.[*].nroCuenta").value(hasItem(DEFAULT_NRO_CUENTA.intValue())))
            .andExpect(jsonPath("$.[*].fechaApertura").value(hasItem(DEFAULT_FECHA_APERTURA.toString())))
            .andExpect(jsonPath("$.[*].moneda").value(hasItem(DEFAULT_MONEDA.toString())))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())));
    }
    
    @Test
    @Transactional
    public void getCuenta() throws Exception {
        // Initialize the database
        cuentaRepository.saveAndFlush(cuenta);

        // Get the cuenta
        restCuentaMockMvc.perform(get("/api/cuentas/{id}", cuenta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cuenta.getId().intValue()))
            .andExpect(jsonPath("$.nroCuenta").value(DEFAULT_NRO_CUENTA.intValue()))
            .andExpect(jsonPath("$.fechaApertura").value(DEFAULT_FECHA_APERTURA.toString()))
            .andExpect(jsonPath("$.moneda").value(DEFAULT_MONEDA.toString()))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCuenta() throws Exception {
        // Get the cuenta
        restCuentaMockMvc.perform(get("/api/cuentas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCuenta() throws Exception {
        // Initialize the database
        cuentaService.save(cuenta);

        int databaseSizeBeforeUpdate = cuentaRepository.findAll().size();

        // Update the cuenta
        Cuenta updatedCuenta = cuentaRepository.findById(cuenta.getId()).get();
        // Disconnect from session so that the updates on updatedCuenta are not directly saved in db
        em.detach(updatedCuenta);
        updatedCuenta
            .nroCuenta(UPDATED_NRO_CUENTA)
            .fechaApertura(UPDATED_FECHA_APERTURA)
            .moneda(UPDATED_MONEDA)
            .estado(UPDATED_ESTADO);

        restCuentaMockMvc.perform(put("/api/cuentas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCuenta)))
            .andExpect(status().isOk());

        // Validate the Cuenta in the database
        List<Cuenta> cuentaList = cuentaRepository.findAll();
        assertThat(cuentaList).hasSize(databaseSizeBeforeUpdate);
        Cuenta testCuenta = cuentaList.get(cuentaList.size() - 1);
        assertThat(testCuenta.getNroCuenta()).isEqualTo(UPDATED_NRO_CUENTA);
        assertThat(testCuenta.getFechaApertura()).isEqualTo(UPDATED_FECHA_APERTURA);
        assertThat(testCuenta.getMoneda()).isEqualTo(UPDATED_MONEDA);
        assertThat(testCuenta.getEstado()).isEqualTo(UPDATED_ESTADO);
    }

    @Test
    @Transactional
    public void updateNonExistingCuenta() throws Exception {
        int databaseSizeBeforeUpdate = cuentaRepository.findAll().size();

        // Create the Cuenta

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCuentaMockMvc.perform(put("/api/cuentas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cuenta)))
            .andExpect(status().isBadRequest());

        // Validate the Cuenta in the database
        List<Cuenta> cuentaList = cuentaRepository.findAll();
        assertThat(cuentaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCuenta() throws Exception {
        // Initialize the database
        cuentaService.save(cuenta);

        int databaseSizeBeforeDelete = cuentaRepository.findAll().size();

        // Delete the cuenta
        restCuentaMockMvc.perform(delete("/api/cuentas/{id}", cuenta.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cuenta> cuentaList = cuentaRepository.findAll();
        assertThat(cuentaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cuenta.class);
        Cuenta cuenta1 = new Cuenta();
        cuenta1.setId(1L);
        Cuenta cuenta2 = new Cuenta();
        cuenta2.setId(cuenta1.getId());
        assertThat(cuenta1).isEqualTo(cuenta2);
        cuenta2.setId(2L);
        assertThat(cuenta1).isNotEqualTo(cuenta2);
        cuenta1.setId(null);
        assertThat(cuenta1).isNotEqualTo(cuenta2);
    }
}
