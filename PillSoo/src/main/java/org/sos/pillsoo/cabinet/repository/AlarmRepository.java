package org.sos.pillsoo.cabinet.repository;

import org.sos.pillsoo.cabinet.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    List<Alarm> findByCabinet_User_UserSeq(int userSeq);

    void deleteById(long alarmSeq);
}
