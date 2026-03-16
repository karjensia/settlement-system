# Settlement System 💰

**모임/회식 정산을 쉽고 공정하게**

> 항목별 참여 인원을 정확히 계산하여, 복잡한 더치페이를 자동으로 해결하는 웹 애플리케이션

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.2-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com/)

**🌐 Live**: [localhost:3001](http://localhost:3001) (Self-hosted)

---

## 🎯 프로젝트 개요

### 배경

회식이나 모임에서 정산할 때 이런 상황을 겪어본 적 있나요?

❌ **문제점**:
- "음식은 7명이 먹었는데, 소주는 4명만 마셨어요"
- "리브는 음식+맥주, 바로는 음식만 먹었는데... 얼마씩?"
- 계산기로 하나하나 계산하기 번거로움
- 누군가 손해보거나 억울한 상황 발생

✅ **해결책**:
- **항목별 참여 인원 관리**: 음식, 맥주, 소주, 막걸리 등 개별 체크
- **자동 정산 계산**: 각자 먹은 것만 정확히 계산
- **공정한 분배**: 참여한 항목의 금액만 n분의 1
- **기록 관리**: 과거 정산 내역 저장 및 조회

---

## ✨ 주요 기능

### 1. 📝 항목별 금액 입력
- 음식, 맥주, 소주, 막걸리, 음료수 등 **자유롭게 추가**
- 각 항목의 금액 입력

### 2. 👥 참여자 관리
- 참여자 이름 등록
- 각 참여자가 **어떤 항목에 참여했는지** 체크

### 3. 🧮 자동 정산 계산
```
음식 138,500원 (7명 참여) → 1인당 19,786원
맥주   5,500원 (2명 참여) → 1인당  2,750원
소주  27,500원 (4명 참여) → 1인당  6,875원
막걸리 8,000원 (2명 참여) → 1인당  4,000원

리브 (음식, 맥주, 소주):
  19,786 + 2,750 + 6,875 = 29,411원

바로 (음식만):
  19,786원
```

### 4. 💾 정산 내역 저장
- 과거 정산 기록 보관
- 언제든 조회 및 재확인 가능
- 정산 삭제 기능

---

## 🚀 빠른 시작

### 사전 요구사항

- **Docker** & **Docker Compose** (권장)
- 또는 **Java 17** + **Node.js 18+** (개발 환경)

### 방법 1: Docker Compose (권장)

```bash
# 1. 저장소 클론
git clone git@github.com:karjensia/settlement-system.git
cd settlement-system

# 2. 실행
docker-compose up --build -d

# 3. 접속
open http://localhost:3001
```

### 방법 2: 개별 실행

#### Backend (Spring Boot)
```bash
cd backend
./gradlew bootRun

# API: http://localhost:8080/api
```

#### Frontend (React)
```bash
cd frontend
npm install
npm start

# UI: http://localhost:3000
```

---

## 📖 사용 방법

### 1단계: 정산 제목 입력
예: "2026년 3월 회식"

### 2단계: 항목 추가
- 음식: 138,500원
- 맥주: 5,500원
- 소주: 27,500원
- 막걸리: 8,000원

### 3단계: 참여자 등록
- 리브
- 바로
- 민수
- ...

### 4단계: 참여 항목 체크
- **리브**: ✅ 음식, ✅ 맥주, ✅ 소주
- **바로**: ✅ 음식
- **민수**: ✅ 음식, ✅ 소주, ✅ 막걸리

### 5단계: 정산하기
자동으로 각자 내야 할 금액이 계산됩니다!

---

## 🧮 정산 계산 로직

### 알고리즘

```
1. 각 항목별로 참여한 인원 수 계산
2. 항목 금액을 참여 인원수로 나눔 (1인당 금액)
3. 각 참여자가 참여한 항목의 1인당 금액을 합산
```

### 예시 계산

**입력 데이터**:
| 항목 | 금액 | 참여자 |
|------|------|--------|
| 음식 | 138,500원 | 리브, 바로, 민수, 철수, 영희, 도현, 지훈 (7명) |
| 맥주 | 5,500원 | 리브, 철수 (2명) |
| 소주 | 27,500원 | 리브, 민수, 영희, 도현 (4명) |
| 막걸리 | 8,000원 | 민수, 지훈 (2명) |

**1인당 금액 계산**:
- 음식: 138,500 ÷ 7 = **19,786원**
- 맥주: 5,500 ÷ 2 = **2,750원**
- 소주: 27,500 ÷ 4 = **6,875원**
- 막걸리: 8,000 ÷ 2 = **4,000원**

**참여자별 정산액**:
- **리브** (음식+맥주+소주): 19,786 + 2,750 + 6,875 = **29,411원**
- **바로** (음식만): **19,786원**
- **민수** (음식+소주+막걸리): 19,786 + 6,875 + 4,000 = **30,661원**

---

## 🛠️ 기술 스택

### Backend
- **Spring Boot** 3.2.2
- **Spring Data JPA** (ORM)
- **H2 Database** (인메모리 DB)
- **Java** 17
- **Gradle** 8.5

### Frontend
- **React** 18
- **Axios** (HTTP 클라이언트)
- **CSS3** (스타일링)

### 인프라
- **Docker** + **Docker Compose**
- **Nginx** (프론트엔드 서빙)
- **Multi-stage Build** (경량 이미지)

---

## 📁 프로젝트 구조

```
settlement-system/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/settlement/
│   │       │   ├── SettlementApplication.java
│   │       │   ├── controller/
│   │       │   │   └── SettlementController.java
│   │       │   ├── dto/
│   │       │   │   ├── SettlementRequest.java
│   │       │   │   └── ParticipantResult.java
│   │       │   ├── model/
│   │       │   │   ├── Settlement.java
│   │       │   │   ├── Item.java
│   │       │   │   └── Participant.java
│   │       │   ├── repository/
│   │       │   │   └── SettlementRepository.java
│   │       │   └── service/
│   │       │       └── SettlementService.java
│   │       └── resources/
│   │           └── application.properties
│   ├── build.gradle
│   └── Dockerfile
├── frontend/                         # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                   # 메인 컴포넌트
│   │   ├── App.css                  # 스타일
│   │   └── index.js                 # 엔트리포인트
│   ├── package.json
│   ├── nginx.conf                    # Nginx 설정
│   └── Dockerfile
├── docker-compose.yml                # Docker Compose 설정
└── README.md                         # 이 문서
```

---

## 🔌 API 엔드포인트

### 1. 정산 생성
```http
POST /api/settlements
Content-Type: application/json

{
  "title": "2026년 3월 회식",
  "items": [
    {"category": "음식", "amount": 138500},
    {"category": "맥주", "amount": 5500},
    {"category": "소주", "amount": 27500},
    {"category": "막걸리", "amount": 8000}
  ],
  "participants": [
    {
      "name": "리브",
      "participatedCategories": ["음식", "맥주", "소주"]
    },
    {
      "name": "바로",
      "participatedCategories": ["음식"]
    }
  ]
}
```

**응답**:
```json
{
  "id": 1,
  "title": "2026년 3월 회식",
  "totalAmount": 179500,
  "createdAt": "2026-03-17T12:00:00",
  "results": [
    {
      "name": "리브",
      "totalAmount": 29411,
      "details": [
        {"category": "음식", "amount": 19786},
        {"category": "맥주", "amount": 2750},
        {"category": "소주", "amount": 6875}
      ]
    },
    {
      "name": "바로",
      "totalAmount": 19786,
      "details": [
        {"category": "음식", "amount": 19786}
      ]
    }
  ]
}
```

### 2. 정산 목록 조회
```http
GET /api/settlements
```

### 3. 정산 상세 조회
```http
GET /api/settlements/{id}
```

### 4. 정산 삭제
```http
DELETE /api/settlements/{id}
```

---

## 🖥️ 화면 구성

### 메인 화면
- 정산 제목 입력
- 항목 추가 (카테고리 + 금액)
- 참여자 추가

### 정산 결과 화면
- 각 참여자별 총액
- 항목별 세부 내역
- 인원수 및 1인당 금액

### 정산 내역 화면
- 과거 정산 목록
- 상세 내역 조회
- 삭제 기능

---

## 🔧 개발 환경 설정

### IntelliJ IDEA

1. **Open**: `File > Open > ~/IdeaProjects/settlement-system/backend`
2. **Gradle 동기화**: 자동으로 의존성 다운로드
3. **Run**: `SettlementApplication.java` 실행

### VS Code

```bash
# Backend
cd backend
./gradlew bootRun

# Frontend (새 터미널)
cd frontend
npm install
npm start
```

---

## 🐛 문제 해결

### 포트 충돌

```bash
# 8081 포트 사용 중인 프로세스 확인
lsof -i :8081

# 프로세스 종료
kill -9 <PID>

# Docker Compose 재시작
docker-compose down
docker-compose up -d
```

### H2 데이터베이스 초기화

```bash
# 볼륨 삭제 후 재시작
docker-compose down -v
docker-compose up -d
```

### CORS 에러

`backend/src/main/resources/application.properties`:
```properties
# CORS 설정
spring.web.cors.allowed-origins=http://localhost:3000,http://localhost:3001
```

---

## 📊 데이터베이스 스키마

### Settlement (정산)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT | Primary Key |
| title | VARCHAR(255) | 정산 제목 |
| total_amount | INTEGER | 총 금액 |
| created_at | TIMESTAMP | 생성 시각 |

### Item (항목)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT | Primary Key |
| settlement_id | BIGINT | Foreign Key → Settlement |
| category | VARCHAR(100) | 카테고리 (음식, 맥주 등) |
| amount | INTEGER | 금액 |

### Participant (참여자)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT | Primary Key |
| settlement_id | BIGINT | Foreign Key → Settlement |
| name | VARCHAR(100) | 이름 |
| total_amount | INTEGER | 정산 금액 |
| participated_categories | TEXT | 참여 항목 (JSON) |

---

## 🚦 향후 개선 계획

### 단기 (1개월)
- [ ] 카카오페이/토스 QR 코드 생성
- [ ] 정산 결과 카카오톡 공유
- [ ] 영수증 OCR 자동 입력

### 중기 (3개월)
- [ ] 사용자 인증 (로그인)
- [ ] 그룹 관리 (팀별 정산)
- [ ] 통계 대시보드 (월별/연도별)

### 장기 (6개월)
- [ ] 모바일 앱 (React Native)
- [ ] 실시간 협업 (WebSocket)
- [ ] 정산 알림 (Push Notification)

---

## 🤝 기여

이슈 및 PR 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

MIT License

---

## 📧 연락처

- **Blog**: [blog.karjensia.com](https://blog.karjensia.com)
- **GitHub**: [@karjensia](https://github.com/karjensia)

---

## 📚 관련 문서

- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [React 공식 문서](https://reactjs.org/)
- [Docker Compose 문서](https://docs.docker.com/compose/)

---

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!**

---

*Last updated: 2026-03-17*
