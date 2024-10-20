package org.sos.pillsoo.cabinet.service;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.auth.repository.UserRepository;
import org.sos.pillsoo.cabinet.dto.CabinetDto;
import org.sos.pillsoo.cabinet.entity.Cabinet;
import org.sos.pillsoo.cabinet.repository.CabinetRepository;
import org.sos.pillsoo.exception.PillSooException;
import org.sos.pillsoo.exception.errorCode.UserErrorCode;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Transactional
public class CabinetService {

    private final CabinetRepository cabinetRepository;
    private final UserRepository userRepository;

    // 복용 중인 영양제 목록 조회
    public List<CabinetDto> getCabinetByUserSeq(int userSeq) {
        List<Cabinet> cabinets = cabinetRepository.findByUser_UserSeq(userSeq);
        return cabinets.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // 복용 중인 영양제 추가
    public void addSupplementToCabinet(int userSeq, int supplementSeq) {
        // 디버그 로그 추가
        System.out.println("Received userSeq: " + userSeq + ", supplementSeq: " + supplementSeq);

        // User 객체를 데이터베이스에서 조회
        User user = userRepository.findById(userSeq)
                .orElseThrow(() -> new PillSooException(UserErrorCode.USER_NOT_FOUND));

        // Supplement 객체 생성
        Supplement supplement = new Supplement(supplementSeq);

        // Cabinet 객체 생성
        Cabinet cabinet = new Cabinet();
        cabinet.setUser(user);
        cabinet.setSupplement(supplement);

        // 데이터베이스에 저장
        cabinetRepository.save(cabinet);
    }

    // 복용 중인 영양제 제거
    @Transactional
    public void removeSupplementFromCabinet(int userSeq, int supplementSeq) {
        cabinetRepository.deleteByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq);
    }

    private CabinetDto convertToDto(Cabinet cabinet) {
        CabinetDto dto = new CabinetDto();
        dto.setSupplementSeq(cabinet.getSupplement().getSupplementSeq());
        dto.setPillName(cabinet.getSupplement().getPillName());
        dto.setFunctionality(cabinet.getSupplement().getFunctionality());
        dto.setImageUrl(cabinet.getSupplement().getImageUrl());
        return dto;
    }
}
