import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JoinPage.css';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function JoinPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [participantName, setParticipantName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  useEffect(() => {
    loadSettlement();
    // eslint-disable-next-line
  }, [uuid]);

  const loadSettlement = async () => {
    try {
      const response = await axios.get(`${API_BASE}/settlements/uuid/${uuid}`);
      
      if (response.data.finalized) {
        alert('이미 계산이 완료된 모임입니다.');
        navigate(`/settlement/${uuid}`);
        return;
      }
      
      setSettlement(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load settlement:', error);
      setError('정산을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const joinSettlement = async () => {
    if (!participantName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (selectedCategories.size === 0) {
      alert('참여할 항목을 선택해주세요.');
      return;
    }

    // 총 인원 체크
    if (settlement.totalParticipants && settlement.participants.length >= settlement.totalParticipants) {
      alert(`참여 인원이 가득 찼습니다. (${settlement.totalParticipants}/${settlement.totalParticipants}명)`);
      return;
    }

    try {
      await axios.post(`${API_BASE}/settlements/uuid/${uuid}/participants`, {
        name: participantName,
        participatedCategories: Array.from(selectedCategories)
      });
      alert('참여가 완료되었습니다!');
      navigate(`/settlement/${uuid}`);
    } catch (error) {
      console.error('Failed to join:', error);
      alert('참여에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="join-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="join-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="join-container">
      <div className="join-card">
        <h2>🎉 {settlement.title}</h2>
        <p className="join-subtitle">모임 정산에 참여하세요!</p>
        
        <div className="participant-count">
          <span className="count-label">총 인원:</span>
          <span className="count-value">{settlement.totalParticipants || '미정'}명</span>
          <span className="count-separator">|</span>
          <span className="count-label">참여자:</span>
          <span className="count-value">{settlement.participants.length}명</span>
        </div>

        <div className="join-section">
          <h3>항목 및 금액</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>항목</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              {settlement.items.map(item => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.amount.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="join-section">
          <h3>참여 정보 입력</h3>
          
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="name-input"
            />
          </div>

          <div className="form-group">
            <label>참여 항목 선택</label>
            <div className="category-checks">
              {settlement.items.map((item) => (
                <label key={item.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(item.category)}
                    onChange={() => toggleCategory(item.category)}
                  />
                  <span className="checkbox-text">{item.category}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={joinSettlement} className="btn-join">
            참여하기
          </button>
        </div>

        <div className="current-participants">
          <h3>현재 참여자 ({settlement.participants.length}명)</h3>
          {settlement.participants.length === 0 ? (
            <p className="empty-message">아직 참여자가 없습니다. 첫 번째가 되어보세요!</p>
          ) : (
            <ul className="participants-list">
              {settlement.participants.map(participant => (
                <li key={participant.id}>
                  <span className="participant-name">{participant.name}</span>
                  <span className="participant-items">
                    {Array.from(participant.participatedCategories).join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default JoinPage;
