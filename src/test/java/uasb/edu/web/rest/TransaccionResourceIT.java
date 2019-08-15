package uasb.edu.web.rest;

import uasb.edu.BancoApp;
import uasb.edu.domain.Transaccion;
import uasb.edu.domain.Cuenta;
import uasb.edu.repository.TransaccionRepository;
import uasb.edu.service.TransaccionService;
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

import uasb.edu.domain.enumeration.TipoTransaccion;
/**
 * Integration tests for the {@link TransaccionResource} REST controller.
 */
@SpringBootTest(classes = BancoApp.class)
public class TransaccionResourceIT {

    private static final Instant DEFAULT_FECHA_TRANSACCION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA_TRANSACCION = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_FECHA_TRANSACCION = Instant.ofEpochMilli(-1L);

    private static final TipoTransaccion DEFAULT_TIPO_TRANSACCION = TipoTransaccion.Ingreso;
    private static final TipoTransaccion UPDATED_TIPO_TRANSACCION = TipoTransaccion.Egreso;

    private static final Long DEFAULT_CANTIDAD = 1L;
    private static final Long UPDATED_CANTIDAD = 2L;
    private static final Long SMALLER_CANTIDAD = 1L - 1L;

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private TransaccionService transaccionService;

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

    private MockMvc restTransaccionMockMvc;

    private Transaccion transaccion;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TransaccionResource transaccionResource = new TransaccionResource(transaccionService);
        this.restTransaccionMockMvc = MockMvcBuilders.standaloneSetup(transaccionResource)
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
    public static Transaccion createEntity(EntityManager em) {
        Transaccion transaccion = new Transaccion()
            .fechaTransaccion(DEFAULT_FECHA_TRANSACCION)
            .tipoTransaccion(DEFAULT_TIPO_TRANSACCION)
            .cantidad(DEFAULT_CANTIDAD)
            .descripcion(DEFAULT_DESCRIPCION);
        // Add required entity
        Cuenta cuenta;
        if (TestUtil.findAll(em, Cuenta.class).isEmpty()) {
            cuenta = CuentaResourceIT.createEntity(em);
            em.persist(cuenta);
            em.flush();
        } else {
            cuenta = TestUtil.findAll(em, Cuenta.class).get(0);
        }
        transaccion.setCuenta(cuenta);
        return transaccion;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transaccion createUpdatedEntity(EntityManager em) {
        Transaccion transaccion = new Transaccion()
            .fechaTransaccion(UPDATED_FECHA_TRANSACCION)
            .tipoTransaccion(UPDATED_TIPO_TRANSACCION)
            .cantidad(UPDATED_CANTIDAD)
            .descripcion(UPDATED_DESCRIPCION);
        // Add required entity
        Cuenta cuenta;
        if (TestUtil.findAll(em, Cuenta.class).isEmpty()) {
            cuenta = CuentaResourceIT.createUpdatedEntity(em);
            em.persist(cuenta);
            em.flush();
        } else {
            cuenta = TestUtil.findAll(em, Cuenta.class).get(0);
        }
        transaccion.setCuenta(cuenta);
        return transaccion;
    }

    @BeforeEach
    public void initTest() {
        transaccion = createEntity(em);
    }

    @Test
    @Transactional
    public void createTransaccion() throws Exception {
        int databaseSizeBeforeCreate = transaccionRepository.findAll().size();

        // Create the Transaccion
        restTransaccionMockMvc.perform(post("/api/transaccions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transaccion)))
            .andExpect(status().isCreated());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeCreate + 1);
        Transaccion testTransaccion = transaccionList.get(transaccionList.size() - 1);
        assertThat(testTransaccion.getFechaTransaccion()).isEqualTo(DEFAULT_FECHA_TRANSACCION);
        assertThat(testTransaccion.getTipoTransaccion()).isEqualTo(DEFAULT_TIPO_TRANSACCION);
        assertThat(testTransaccion.getCantidad()).isEqualTo(DEFAULT_CANTIDAD);
        assertThat(testTransaccion.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    public void createTransaccionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = transaccionRepository.findAll().size();

        // Create the Transaccion with an existing ID
        transaccion.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransaccionMockMvc.perform(post("/api/transaccions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transaccion)))
            .andExpect(status().isBadRequest());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllTransaccions() throws Exception {
        // Initialize the database
        transaccionRepository.saveAndFlush(transaccion);

        // Get all the transaccionList
        restTransaccionMockMvc.perform(get("/api/transaccions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transaccion.getId().intValue())))
            .andExpect(jsonPath("$.[*].fechaTransaccion").value(hasItem(DEFAULT_FECHA_TRANSACCION.toString())))
            .andExpect(jsonPath("$.[*].tipoTransaccion").value(hasItem(DEFAULT_TIPO_TRANSACCION.toString())))
            .andExpect(jsonPath("$.[*].cantidad").value(hasItem(DEFAULT_CANTIDAD.intValue())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION.toString())));
    }
    
    @Test
    @Transactional
    public void getTransaccion() throws Exception {
        // Initialize the database
        transaccionRepository.saveAndFlush(transaccion);

        // Get the transaccion
        restTransaccionMockMvc.perform(get("/api/transaccions/{id}", transaccion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(transaccion.getId().intValue()))
            .andExpect(jsonPath("$.fechaTransaccion").value(DEFAULT_FECHA_TRANSACCION.toString()))
            .andExpect(jsonPath("$.tipoTransaccion").value(DEFAULT_TIPO_TRANSACCION.toString()))
            .andExpect(jsonPath("$.cantidad").value(DEFAULT_CANTIDAD.intValue()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTransaccion() throws Exception {
        // Get the transaccion
        restTransaccionMockMvc.perform(get("/api/transaccions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTransaccion() throws Exception {
        // Initialize the database
        transaccionService.save(transaccion);

        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();

        // Update the transaccion
        Transaccion updatedTransaccion = transaccionRepository.findById(transaccion.getId()).get();
        // Disconnect from session so that the updates on updatedTransaccion are not directly saved in db
        em.detach(updatedTransaccion);
        updatedTransaccion
            .fechaTransaccion(UPDATED_FECHA_TRANSACCION)
            .tipoTransaccion(UPDATED_TIPO_TRANSACCION)
            .cantidad(UPDATED_CANTIDAD)
            .descripcion(UPDATED_DESCRIPCION);

        restTransaccionMockMvc.perform(put("/api/transaccions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTransaccion)))
            .andExpect(status().isOk());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
        Transaccion testTransaccion = transaccionList.get(transaccionList.size() - 1);
        assertThat(testTransaccion.getFechaTransaccion()).isEqualTo(UPDATED_FECHA_TRANSACCION);
        assertThat(testTransaccion.getTipoTransaccion()).isEqualTo(UPDATED_TIPO_TRANSACCION);
        assertThat(testTransaccion.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
        assertThat(testTransaccion.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    public void updateNonExistingTransaccion() throws Exception {
        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();

        // Create the Transaccion

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransaccionMockMvc.perform(put("/api/transaccions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transaccion)))
            .andExpect(status().isBadRequest());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTransaccion() throws Exception {
        // Initialize the database
        transaccionService.save(transaccion);

        int databaseSizeBeforeDelete = transaccionRepository.findAll().size();

        // Delete the transaccion
        restTransaccionMockMvc.perform(delete("/api/transaccions/{id}", transaccion.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Transaccion.class);
        Transaccion transaccion1 = new Transaccion();
        transaccion1.setId(1L);
        Transaccion transaccion2 = new Transaccion();
        transaccion2.setId(transaccion1.getId());
        assertThat(transaccion1).isEqualTo(transaccion2);
        transaccion2.setId(2L);
        assertThat(transaccion1).isNotEqualTo(transaccion2);
        transaccion1.setId(null);
        assertThat(transaccion1).isNotEqualTo(transaccion2);
    }
}
