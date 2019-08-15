package uasb.edu.web.rest;

import uasb.edu.domain.Transaccion;
import uasb.edu.service.TransaccionService;
import uasb.edu.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link uasb.edu.domain.Transaccion}.
 */
@RestController
@RequestMapping("/api")
public class TransaccionResource {

    private final Logger log = LoggerFactory.getLogger(TransaccionResource.class);

    private static final String ENTITY_NAME = "transaccion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TransaccionService transaccionService;

    public TransaccionResource(TransaccionService transaccionService) {
        this.transaccionService = transaccionService;
    }

    /**
     * {@code POST  /transaccions} : Create a new transaccion.
     *
     * @param transaccion the transaccion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new transaccion, or with status {@code 400 (Bad Request)} if the transaccion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/transaccions")
    public ResponseEntity<Transaccion> createTransaccion(@Valid @RequestBody Transaccion transaccion) throws URISyntaxException {
        log.debug("REST request to save Transaccion : {}", transaccion);
        if (transaccion.getId() != null) {
            throw new BadRequestAlertException("A new transaccion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Transaccion result = transaccionService.save(transaccion);
        return ResponseEntity.created(new URI("/api/transaccions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /transaccions} : Updates an existing transaccion.
     *
     * @param transaccion the transaccion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated transaccion,
     * or with status {@code 400 (Bad Request)} if the transaccion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the transaccion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/transaccions/{id}")
    public ResponseEntity<Transaccion> updateTransaccion(@PathVariable Long id,@Valid @RequestBody Transaccion transaccion) throws URISyntaxException {
        log.debug("REST request to update Transaccion : {}", transaccion);
        if (transaccion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Transaccion result = transaccionService.save(transaccion);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, transaccion.getId().toString()))
            .body(result);
    }

    /**
     *
     * @param transaccion the transaccion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated transaccion,
     * or with status {@code 400 (Bad Request)} if the transaccion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the transaccion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping("/transaccions/{id}")
    public ResponseEntity<Transaccion> partialUpdateTransaccion(@PathVariable Long id,@RequestBody Transaccion transaccion) throws URISyntaxException {
        log.debug("REST request to update Transaccion : {}", transaccion);
        if (transaccion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Transaccion result = transaccionService.save(transaccion);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, transaccion.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /transaccions} : get all the transaccions.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of transaccions in body.
     */
    @GetMapping("/transaccions")
    public List<Transaccion> getAllTransaccions() {
        log.debug("REST request to get all Transaccions");
        return transaccionService.findAll();
    }

    /**
     * {@code GET  /transaccions/:id} : get the "id" transaccion.
     *
     * @param id the id of the transaccion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the transaccion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/transaccions/{id}")
    public ResponseEntity<Transaccion> getTransaccion(@PathVariable Long id) {
        log.debug("REST request to get Transaccion : {}", id);
        Optional<Transaccion> transaccion = transaccionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(transaccion);
    }

    /**
     * {@code DELETE  /transaccions/:id} : delete the "id" transaccion.
     *
     * @param id the id of the transaccion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/transaccions/{id}")
    public ResponseEntity<Void> deleteTransaccion(@PathVariable Long id) {
        log.debug("REST request to delete Transaccion : {}", id);
        transaccionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
