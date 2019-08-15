package uasb.edu.repository;

import uasb.edu.domain.Transaccion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Transaccion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

}
