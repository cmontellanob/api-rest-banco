package uasb.edu.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import uasb.edu.domain.enumeration.Moneda;

import uasb.edu.domain.enumeration.Estado;

/**
 * A Cuenta.
 */
@Entity
@Table(name = "cuenta")
public class Cuenta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "nro_cuenta", nullable = false)
    private Long nroCuenta;

    @Column(name = "fecha_apertura")
    private Instant fechaApertura;

    @Enumerated(EnumType.STRING)
    @Column(name = "moneda")
    private Moneda moneda;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado;

    @OneToMany(mappedBy = "cuenta")
    private Set<Transaccion> transaccions = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("cuentas")
    private Cliente cliente;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNroCuenta() {
        return nroCuenta;
    }

    public Cuenta nroCuenta(Long nroCuenta) {
        this.nroCuenta = nroCuenta;
        return this;
    }

    public void setNroCuenta(Long nroCuenta) {
        this.nroCuenta = nroCuenta;
    }

    public Instant getFechaApertura() {
        return fechaApertura;
    }

    public Cuenta fechaApertura(Instant fechaApertura) {
        this.fechaApertura = fechaApertura;
        return this;
    }

    public void setFechaApertura(Instant fechaApertura) {
        this.fechaApertura = fechaApertura;
    }

    public Moneda getMoneda() {
        return moneda;
    }

    public Cuenta moneda(Moneda moneda) {
        this.moneda = moneda;
        return this;
    }

    public void setMoneda(Moneda moneda) {
        this.moneda = moneda;
    }

    public Estado getEstado() {
        return estado;
    }

    public Cuenta estado(Estado estado) {
        this.estado = estado;
        return this;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public Set<Transaccion> getTransaccions() {
        return transaccions;
    }

    public Cuenta transaccions(Set<Transaccion> transaccions) {
        this.transaccions = transaccions;
        return this;
    }

    public Cuenta addTransaccion(Transaccion transaccion) {
        this.transaccions.add(transaccion);
        transaccion.setCuenta(this);
        return this;
    }

    public Cuenta removeTransaccion(Transaccion transaccion) {
        this.transaccions.remove(transaccion);
        transaccion.setCuenta(null);
        return this;
    }

    public void setTransaccions(Set<Transaccion> transaccions) {
        this.transaccions = transaccions;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public Cuenta cliente(Cliente cliente) {
        this.cliente = cliente;
        return this;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cuenta)) {
            return false;
        }
        return id != null && id.equals(((Cuenta) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Cuenta{" +
            "id=" + getId() +
            ", nroCuenta=" + getNroCuenta() +
            ", fechaApertura='" + getFechaApertura() + "'" +
            ", moneda='" + getMoneda() + "'" +
            ", estado='" + getEstado() + "'" +
            "}";
    }
}
