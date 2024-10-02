package org.sos.pillsoo.alarm.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class AlarmResDto {

    private long alarmSeq;
    private int userSeq;
    private int supplementSeq;
    private LocalTime time;
    private boolean isTurnOn = true;


}
