package uasb.edu.service.impl;

import uasb.edu.service.TransaccionService;
import uasb.edu.domain.Cliente;
import uasb.edu.domain.Transaccion;
import uasb.edu.repository.TransaccionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Transaccion}.
 */
@Service
@Transactional
public class TransaccionServiceImpl implements TransaccionService {

    private final Logger log = LoggerFactory.getLogger(TransaccionServiceImpl.class);

    private final TransaccionRepository transaccionRepository;

    public TransaccionServiceImpl(TransaccionRepository transaccionRepository) {
        this.transaccionRepository = transaccionRepository;
    }

    /**
     * Save a transaccion.
     *
     * @param transaccion the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Transaccion save(Transaccion transaccion) {
        log.debug("Request to save Transaccion : {}", transaccion);
        return transaccionRepository.save(transaccion);
    }

    /**
     * Get all the transaccions.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Transaccion> findAll() {
        log.debug("Request to get all Transaccions");
        return transaccionRepository.findAll();
    }


    /**
     * Get one transaccion by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Transaccion> findOne(Long id) {
        log.debug("Request to get Transaccion : {}", id);
        return transaccionRepository.findById(id);
    }

    /**
     * Delete the transaccion by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Transaccion : {}", id);
        transaccionRepository.deleteById(id);
    }
    public Transaccion partialSave(Transaccion partialTransaccion) {
        log.debug("Request to save Cliente : {}", partialTransaccion);
        Optional<Transaccion> transaccion = transaccionRepository.findById(partialTransaccion.getId());
        if (partialTransaccion.getCantidad() == null) {
        	partialTransaccion.setCantidad(transaccion.get().getCantidad());
        }
        if (partialTransaccion.getCuenta() == null) {
        	partialTransaccion.setCuenta(transaccion.get().getCuenta());
        }
        if (partialTransaccion.getDescripcion() == null) {
        	partialTransaccion.setDescripcion(transaccion.get().getDescripcion());
        }
        if (partialTransaccion.getFechaTransaccion() == null) {
        	partialTransaccion.setFechaTransaccion(transaccion.get().getFechaTransaccion());
        }
        if (partialTransaccion.getTipoTransaccion() == null) {
        	partialTransaccion.setTipoTransaccion(transaccion.get().getTipoTransaccion());
        }

        return transaccionRepository.save(partialTransaccion);
    }
}

