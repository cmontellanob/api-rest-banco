package uasb.edu.service;

import uasb.edu.domain.Cuenta;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link Cuenta}.
 */
public interface CuentaService {

    /**
     * Save a cuenta.
     *
     * @param cuenta the entity to save.
     * @return the persisted entity.
     */
    Cuenta save(Cuenta cuenta);

    /**
     * Get all the cuentas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Cuenta> findAll(Pageable pageable);


    /**
     * Get the "id" cuenta.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Cuenta> findOne(Long id);

    /**
     * Delete the "id" cuenta.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
     /**
     * Save a cuenta.
     *
     * @param cuenta the entity to save
     * @return the persisted entity
     */
    Cuenta partialSave(Cuenta cuenta);
}
