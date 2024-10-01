package org.sos.pillsoo.supplement.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class ReviewDto {
    private long reviewSeq;
    private int userSeq;
    private int supplementSeq;
    private String userName;
    /**
     * User 클래스의 userId를 넣으면 된다.
     */
    private String nickName;
    private String content;
    private Timestamp createdAt;  // createdAt 필드 추가
}
