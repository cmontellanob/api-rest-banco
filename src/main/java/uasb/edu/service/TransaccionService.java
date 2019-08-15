package uasb.edu.service;

import uasb.edu.domain.Transaccion;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Transaccion}.
 */
public interface TransaccionService {

    /**
     * Save a transaccion.
     *
     * @param transaccion the entity to save.
     * @return the persisted entity.
     */
    Transaccion save(Transaccion transaccion);

    /**
     * Get all the transaccions.
     *
     * @return the list of entities.
     */
    List<Transaccion> findAll();


    /**
     * Get the "id" transaccion.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Transaccion> findOne(Long id);

    /**
     * Delete the "id" transaccion.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
     /**
     * Save a transaccion.
     *
     * @param transaccion the entity to save.
     * @return the persisted entity.
     */
    Transaccion partialSave(Transaccion transaccion);

}
