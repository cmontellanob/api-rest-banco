package uasb.edu.service.impl;

import uasb.edu.service.ClienteService;
import uasb.edu.domain.Cliente;
import uasb.edu.repository.ClienteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Cliente}.
 */
@Service
@Transactional
public class ClienteServiceImpl implements ClienteService {

    private final Logger log = LoggerFactory.getLogger(ClienteServiceImpl.class);

    private final ClienteRepository clienteRepository;

    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    /**
     * Save a cliente.
     *
     * @param cliente the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Cliente save(Cliente cliente) {
        log.debug("Request to save Cliente : {}", cliente);
        return clienteRepository.save(cliente);
    }

    /**
     * Get all the clientes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Cliente> findAll(Pageable pageable) {
        log.debug("Request to get all Clientes");
        return clienteRepository.findAll(pageable);
    }


    /**
     * Get one cliente by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Cliente> findOne(Long id) {
        log.debug("Request to get Cliente : {}", id);
        return clienteRepository.findById(id);
    }

    /**
     * Delete the cliente by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Cliente : {}", id);
        clienteRepository.deleteById(id);
    }
    /**
     * Save a clientes.
     *
     * @param cliente the entity to save
     * @return the persisted entity
     */
    @Override
    public Cliente partialSave(Cliente partialCliente) {
        log.debug("Request to save Cliente : {}", partialCliente);
        Optional<Cliente> cliente = clienteRepository.findById(partialCliente.getId());
        if (partialCliente.getDocumentoIdentidad() == null) {
            partialCliente.setDocumentoIdentidad(cliente.get().getDocumentoIdentidad());
        }
        if (partialCliente.getNombres() == null) {
            partialCliente.setNombres(cliente.get().getNombres());
        }
        if (partialCliente.getPrimerApellido() == null) {
            partialCliente.setPrimerApellido(cliente.get().getPrimerApellido());
        }
        if (partialCliente.getSegundoApellido()== null) {
            partialCliente.setSegundoApellido(cliente.get().getSegundoApellido());
        }
        if (partialCliente.getCuentas() == null) {
            partialCliente.setCuentas(cliente.get().getCuentas());
        }
        if (partialCliente.getCorreo() == null) {
            partialCliente.setCorreo(cliente.get().getCorreo());
        }
        if (partialCliente.getCelular() == null) {
            partialCliente.setCelular(cliente.get().getCelular());
        }
        return clienteRepository.save(partialCliente);
    }
}
