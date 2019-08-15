package uasb.edu.service.impl;

import uasb.edu.service.CuentaService;
import uasb.edu.domain.Cliente;
import uasb.edu.domain.Cuenta;
import uasb.edu.repository.CuentaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Cuenta}.
 */
@Service
@Transactional
public class CuentaServiceImpl implements CuentaService {

    private final Logger log = LoggerFactory.getLogger(CuentaServiceImpl.class);

    private final CuentaRepository cuentaRepository;

    public CuentaServiceImpl(CuentaRepository cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }

    /**
     * Save a cuenta.
     *
     * @param cuenta the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Cuenta save(Cuenta cuenta) {
        log.debug("Request to save Cuenta : {}", cuenta);
        return cuentaRepository.save(cuenta);
    }

    /**
     * Get all the cuentas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Cuenta> findAll(Pageable pageable) {
        log.debug("Request to get all Cuentas");
        return cuentaRepository.findAll(pageable);
    }


    /**
     * Get one cuenta by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Cuenta> findOne(Long id) {
        log.debug("Request to get Cuenta : {}", id);
        return cuentaRepository.findById(id);
    }

    /**
     * Delete the cuenta by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Cuenta : {}", id);
        cuentaRepository.deleteById(id);
    }
    
    public Cuenta partialSave(Cuenta partialCuenta) {
        log.debug("Request to save Cuenta : {}", partialCuenta);
        Optional<Cuenta> cuenta = cuentaRepository.findById(partialCuenta.getId());
        if (partialCuenta.getCliente() == null) {
        	partialCuenta.setCliente(cuenta.get().getCliente());
        }
        if (partialCuenta.getEstado() == null) {
        	partialCuenta.setEstado(cuenta.get().getEstado());
        }
        if (partialCuenta.getFechaApertura() == null) {
        	partialCuenta.setFechaApertura(cuenta.get().getFechaApertura());
        }
        if (partialCuenta.getMoneda() == null) {
        	partialCuenta.setMoneda(cuenta.get().getMoneda());
        }
        if (partialCuenta.getNroCuenta() == null) {
        	partialCuenta.setNroCuenta(cuenta.get().getNroCuenta());
        }
        if (partialCuenta.getTransaccions() == null) {
        	partialCuenta.setTransaccions(cuenta.get().getTransaccions());
        }
        
        return cuentaRepository.save(partialCuenta);
    }
}

