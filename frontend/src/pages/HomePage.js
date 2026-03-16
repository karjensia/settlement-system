import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function HomePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [totalParticipants, setTotalParticipants] = useState(''); // 총 인원수
  const [items, setItems] = useState([{ category: '음식', amount: '' }]);
  
  // 정산 리스트
  const [settlements, setSettlements] = useState([]);
  
  // 삭제 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    loadSettlements();
  }, []);

  const loadSettlements = async () => {
    try {
      const response = await axios.get(`${API_BASE}/settlements`);
      setSettlements(response.data);
    } catch (error) {
      console.error('Failed to load settlements:', error);
    }
  };

  const addItem = () => {
    setItems([...items, { category: '', amount: '' }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    if (field === 'amount') {
      // 빈 값이면 빈 문자열로, 값이 있으면 숫자로 변환
      newItems[index][field] = value === '' ? '' : (parseInt(value) || '');
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const createSettlement = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!totalParticipants || totalParticipants === '' || parseInt(totalParticipants) <= 0) {
      alert('총 인원수를 입력해주세요.');
      return;
    }

    if (items.some(item => !item.category.trim())) {
      alert('모든 항목의 이름을 입력해주세요.');
      return;
    }

    if (items.some(item => !item.amount || item.amount === '')) {
      alert('모든 항목의 금액을 입력해주세요.');
      return;
    }

    const request = {
      title,
      password,
      totalParticipants: parseInt(totalParticipants),
      items: items.map(item => ({ 
        category: item.category, 
        amount: parseInt(item.amount) || 0
      }))
    };

    try {
      const response = await axios.post(`${API_BASE}/settlements`, request);
      const uuid = response.data.uuid;
      alert('정산이 생성되었습니다. 고유 링크로 이동합니다.');
      navigate(`/settlement/${uuid}`);
    } catch (error) {
      console.error('Failed to create settlement:', error);
      alert('정산 생성에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setPassword('');
    setTotalParticipants('');
    setItems([{ category: '음식', amount: '' }]);
  };

  const openDeleteModal = (settlement) => {
    setDeleteTarget(settlement);
    setShowDeleteModal(true);
    setDeletePassword('');
  };

  const deleteSettlement = async () => {
    if (!deletePassword.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    try {
      await axios.delete(`${API_BASE}/settlements/uuid/${deleteTarget.uuid}`, {
        data: { password: deletePassword }
      });
      alert('정산이 삭제되었습니다.');
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeletePassword('');
      loadSettlements();
    } catch (error) {
      console.error('Failed to delete settlement:', error);
      alert('비밀번호가 일치하지 않거나 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="container">
      <div className="usage-guide">
        <h2>💡 사용 방법</h2>
        <div className="guide-steps">
          <div className="guide-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>정산 생성</h3>
              <p>제목, 비밀번호, <strong>총 인원수</strong>를 입력하고, 정산할 항목(음식, 술 등)과 금액을 등록합니다.</p>
              <p className="guide-note">💡 총 인원수를 설정하면 해당 인원까지만 참여 가능합니다.</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>참여자 초대</h3>
              <p>"👥 참여자 초대 링크" 버튼을 눌러 링크를 복사하고, 카카오톡이나 문자로 공유합니다.</p>
              <p className="guide-note">💡 인앱 브라우저에서는 외부 브라우저로 열어서 사용하세요!</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>참여 등록</h3>
              <p>각 참여자가 초대 링크에서 자신의 이름과 참여한 항목을 선택한 후 "참여하기"를 클릭합니다.</p>
              <p className="guide-note">💡 정산 페이지에서 직접 참여하거나, 비밀번호로 수정/삭제도 가능합니다.</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>계산 완료</h3>
              <p>모든 참여자 입력 후 "계산하기" 버튼을 눌러 최종 금액을 확정합니다.</p>
              <p className="guide-note">💡 계산 결과는 텍스트 복사, 파일 다운로드, 카카오톡 공유 가능합니다.</p>
            </div>
          </div>
        </div>
        <div className="guide-footer">
          <p><strong>✨ 꿀팁:</strong> 우측 정산 목록에서 기존 정산을 클릭하면 바로 접근할 수 있습니다!</p>
        </div>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="form-section">
            <h2>새 정산 만들기</h2>
            
            <div className="form-group">
              <label>제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 2024년 1월 회식"
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="계산 완료 시 필요한 비밀번호"
              />
            </div>

            <div className="form-group">
              <label>총 인원수</label>
              <input
                type="number"
                value={totalParticipants}
                onChange={(e) => setTotalParticipants(e.target.value)}
                placeholder="예: 7"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>항목</label>
              {items.map((item, index) => (
                <div key={index} className="item-row">
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => updateItem(index, 'category', e.target.value)}
                    placeholder="항목명 (예: 음식, 맥주)"
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(index, 'amount', e.target.value)}
                    placeholder="금액"
                  />
                  <button onClick={() => removeItem(index)} className="btn-remove">삭제</button>
                </div>
              ))}
              <button onClick={addItem} className="btn-add">+ 항목 추가</button>
            </div>

            <div className="form-actions">
              <button onClick={createSettlement} className="btn-primary">정산 생성</button>
              <button onClick={resetForm} className="btn-secondary">초기화</button>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="list-section">
            <h2>정산 목록</h2>
            {settlements.length === 0 ? (
              <p className="empty-message">생성된 정산이 없습니다.</p>
            ) : (
              <ul className="settlement-list">
                {settlements.map(settlement => (
                  <li key={settlement.id} className="settlement-item">
                    <div 
                      className="settlement-info clickable"
                      onClick={() => navigate(`/settlement/${settlement.uuid}`)}
                    >
                      <h3>{settlement.title}</h3>
                      <p className="settlement-date">
                        {new Date(settlement.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                      </p>
                      {settlement.finalized && (
                        <span className="finalized-badge">계산 완료</span>
                      )}
                    </div>
                    <button 
                      onClick={() => openDeleteModal(settlement)} 
                      className="btn-delete-small"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && deleteTarget && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>정산 삭제</h3>
            <p><strong>{deleteTarget.title}</strong>을(를) 삭제하시겠습니까?</p>
            <p className="warning-text">⚠️ 삭제된 정산은 복구할 수 없습니다.</p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="비밀번호"
              onKeyPress={(e) => e.key === 'Enter' && deleteSettlement()}
            />
            <div className="modal-actions">
              <button onClick={deleteSettlement} className="btn-danger">삭제</button>
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
