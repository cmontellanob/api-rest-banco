package uasb.edu.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

import uasb.edu.domain.enumeration.TipoTransaccion;

/**
 * A Transaccion.
 */
@Entity
@Table(name = "transaccion")
public class Transaccion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_transaccion")
    private Instant fechaTransaccion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_transaccion")
    private TipoTransaccion tipoTransaccion;

    @Column(name = "cantidad")
    private Long cantidad;

    @Column(name = "descripcion")
    private String descripcion;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("transaccions")
    private Cuenta cuenta;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getFechaTransaccion() {
        return fechaTransaccion;
    }

    public Transaccion fechaTransaccion(Instant fechaTransaccion) {
        this.fechaTransaccion = fechaTransaccion;
        return this;
    }

    public void setFechaTransaccion(Instant fechaTransaccion) {
        this.fechaTransaccion = fechaTransaccion;
    }

    public TipoTransaccion getTipoTransaccion() {
        return tipoTransaccion;
    }

    public Transaccion tipoTransaccion(TipoTransaccion tipoTransaccion) {
        this.tipoTransaccion = tipoTransaccion;
        return this;
    }

    public void setTipoTransaccion(TipoTransaccion tipoTransaccion) {
        this.tipoTransaccion = tipoTransaccion;
    }

    public Long getCantidad() {
        return cantidad;
    }

    public Transaccion cantidad(Long cantidad) {
        this.cantidad = cantidad;
        return this;
    }

    public void setCantidad(Long cantidad) {
        this.cantidad = cantidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Transaccion descripcion(String descripcion) {
        this.descripcion = descripcion;
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Cuenta getCuenta() {
        return cuenta;
    }

    public Transaccion cuenta(Cuenta cuenta) {
        this.cuenta = cuenta;
        return this;
    }

    public void setCuenta(Cuenta cuenta) {
        this.cuenta = cuenta;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transaccion)) {
            return false;
        }
        return id != null && id.equals(((Transaccion) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Transaccion{" +
            "id=" + getId() +
            ", fechaTransaccion='" + getFechaTransaccion() + "'" +
            ", tipoTransaccion='" + getTipoTransaccion() + "'" +
            ", cantidad=" + getCantidad() +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}
