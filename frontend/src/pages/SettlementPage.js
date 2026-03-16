import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SettlementPage.css';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function SettlementPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 참여자 추가 폼
  const [participantName, setParticipantName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  
  // 계산하기 모달
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalizePassword, setFinalizePassword] = useState('');
  
  // 참여자 편집 모달
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategories, setEditCategories] = useState(new Set());
  const [editPassword, setEditPassword] = useState('');
  
  // 참여자 삭제 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingParticipant, setDeletingParticipant] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    loadSettlement();
  }, [uuid]);

  const loadSettlement = async () => {
    try {
      const response = await axios.get(`${API_BASE}/settlements/uuid/${uuid}`);
      setSettlement(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load settlement:', error);
      setError('정산을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

    const copyInviteLink = async () => {
    const link = window.location.origin + "/settlement/join/" + uuid;
    
    // 인앱 브라우저 감지
    const isInAppBrowser = /KAKAOTALK|NAVER|Line|Instagram|FBAV|FBAN/i.test(navigator.userAgent);
    
    // 모달 표시 함수
    const showLinkModal = (copied = false) => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
      `;
      
      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 100%;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      `;
      
      const title = document.createElement('h3');
      title.textContent = copied ? '✅ 링크 복사 완료!' : '🔗 참여자 초대 링크';
      title.style.cssText = `margin: 0 0 15px 0; color: ${copied ? '#4CAF50' : '#667eea'}; font-size: 22px; text-align: center;`;
      
      const desc = document.createElement('p');
      desc.textContent = '아래 링크를 공유하여 참여자를 초대하세요:';
      desc.style.cssText = 'color: #666; font-size: 15px; margin-bottom: 15px; text-align: center;';
      
      const input = document.createElement('input');
      input.type = 'text';
      input.value = link;
      input.readOnly = true;
      input.style.cssText = `
        width: 100%;
        padding: 14px;
        border: 2px solid #667eea;
        border-radius: 8px;
        font-size: 14px;
        font-family: monospace;
        background: #f8f9fa;
        color: #333;
        box-sizing: border-box;
        margin-bottom: 15px;
        text-align: center;
      `;
      
      setTimeout(() => {
        input.focus();
        input.select();
      }, 100);
      
      const copyBtn = document.createElement('button');
      copyBtn.textContent = copied ? '✅ 복사 완료' : '📋 다시 복사하기';
      copyBtn.disabled = copied;
      copyBtn.style.cssText = `
        width: 100%;
        padding: 14px;
        background: ${copied ? '#ccc' : '#667eea'};
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: ${copied ? 'default' : 'pointer'};
        margin-bottom: 10px;
      `;
      
      if (!copied) {
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(link);
            copyBtn.textContent = '✅ 복사 완료';
            copyBtn.disabled = true;
            copyBtn.style.background = '#4CAF50';
            copyBtn.style.cursor = 'default';
          } catch (error) {
            alert('복사에 실패했습니다. 링크를 길게 눌러서 복사해주세요.');
          }
        };
      }
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '닫기';
      closeBtn.style.cssText = `
        width: 100%;
        padding: 12px;
        background: #f0f0f0;
        color: #666;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        cursor: pointer;
      `;
      
      content.appendChild(title);
      content.appendChild(desc);
      content.appendChild(input);
      content.appendChild(copyBtn);
      content.appendChild(closeBtn);
      modal.appendChild(content);
      document.body.appendChild(modal);
      
      closeBtn.onclick = () => {
        document.body.removeChild(modal);
      };
      
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      };
    };
    
    // 인앱 브라우저면 경고 모달
    if (isInAppBrowser) {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
      `;
      
      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        padding: 25px;
        border-radius: 15px;
        max-width: 450px;
        width: 100%;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      `;
      
      const title = document.createElement('h3');
      title.textContent = '⚠️ 인앱 브라우저 감지';
      title.style.cssText = 'margin: 0 0 15px 0; color: #FF6B6B; font-size: 20px; text-align: center;';
      
      const desc = document.createElement('p');
      desc.innerHTML = '복사 기능이 제한될 수 있습니다.<br>외부 브라우저에서 열어주세요.';
      desc.style.cssText = 'color: #666; font-size: 15px; margin-bottom: 20px; text-align: center; line-height: 1.6;';
      
      const instruction = document.createElement('div');
      instruction.innerHTML = `
        <div style="
          background: #FFF3CD;
          border: 2px solid #FFC107;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        ">
          <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: bold;">
            📱 외부 브라우저로 열기:
          </p>
          <ol style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.8;">
            <li>우측 상단 <strong>⋯</strong> (더보기) 클릭</li>
            <li><strong>"Safari로 열기"</strong> 또는<br><strong>"Chrome으로 열기"</strong> 선택</li>
            <li>외부 브라우저에서 링크 복사!</li>
          </ol>
        </div>
      `;
      
      const tryBtn = document.createElement('button');
      tryBtn.textContent = '그래도 시도하기';
      tryBtn.style.cssText = `
        width: 100%;
        padding: 14px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        margin-bottom: 10px;
      `;
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '닫기';
      closeBtn.style.cssText = `
        width: 100%;
        padding: 12px;
        background: #ccc;
        color: #666;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        cursor: pointer;
      `;
      
      content.appendChild(title);
      content.appendChild(desc);
      content.appendChild(instruction);
      content.appendChild(tryBtn);
      content.appendChild(closeBtn);
      modal.appendChild(content);
      document.body.appendChild(modal);
      
      tryBtn.onclick = () => {
        document.body.removeChild(modal);
        showLinkModal(false);
      };
      
      closeBtn.onclick = () => {
        document.body.removeChild(modal);
      };
      
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      };
      
      return;
    }
    
    // 일반 브라우저: 복사 시도
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
        copied = true;
      }
    } catch (error) {
      console.log('Clipboard copy failed:', error);
    }
    
    // 모달 표시
    showLinkModal(copied);
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

  const addParticipant = async () => {
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
      const response = await axios.post(`${API_BASE}/settlements/uuid/${uuid}/participants`, {
        name: participantName,
        participatedCategories: Array.from(selectedCategories)
      });
      setSettlement(response.data);
      setParticipantName('');
      setSelectedCategories(new Set());
      alert('참여자가 추가되었습니다!');
    } catch (error) {
      console.error('Failed to add participant:', error);
      alert('참여자 추가에 실패했습니다.');
    }
  };

  const openFinalizeModal = () => {
    if (settlement.participants.length === 0) {
      alert('참여자가 한 명도 없습니다. 참여자를 먼저 추가해주세요.');
      return;
    }
    setShowFinalizeModal(true);
  };

  const finalizeSettlement = async () => {
    if (!finalizePassword.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/settlements/uuid/${uuid}/finalize`, {
        password: finalizePassword
      });
      setSettlement(response.data);
      setShowFinalizeModal(false);
      setFinalizePassword('');
      alert('계산이 완료되었습니다!');
    } catch (error) {
      console.error('Failed to finalize settlement:', error);
      alert('비밀번호가 일치하지 않거나 계산 완료에 실패했습니다.');
    }
  };
  
  const openEditModal = (participant) => {
    setEditingParticipant(participant);
    setEditName(participant.name);
    setEditCategories(new Set(participant.participatedCategories));
    setEditPassword('');
    setShowEditModal(true);
  };
  
  const toggleEditCategory = (category) => {
    const newCategories = new Set(editCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setEditCategories(newCategories);
  };
  
  const updateParticipant = async () => {
    if (!editName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    
    if (editCategories.size === 0) {
      alert('최소 하나 이상의 항목을 선택해주세요.');
      return;
    }
    
    if (!editPassword.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    
    try {
      const response = await axios.put(
        `${API_BASE}/settlements/uuid/${uuid}/participants/${editingParticipant.id}`,
        {
          name: editName,
          participatedCategories: Array.from(editCategories),
          password: editPassword
        }
      );
      setSettlement(response.data);
      setShowEditModal(false);
      setEditingParticipant(null);
      setEditName('');
      setEditCategories(new Set());
      setEditPassword('');
      alert('참여자가 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update participant:', error);
      alert('비밀번호가 일치하지 않거나 수정에 실패했습니다.');
    }
  };
  
  const openDeleteModal = (participant) => {
    setDeletingParticipant(participant);
    setDeletePassword('');
    setShowDeleteModal(true);
  };
  
  const deleteParticipant = async () => {
    if (!deletePassword.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    
    try {
      const response = await axios.delete(
        `${API_BASE}/settlements/uuid/${uuid}/participants/${deletingParticipant.id}`,
        {
          data: { password: deletePassword }
        }
      );
      setSettlement(response.data);
      setShowDeleteModal(false);
      setDeletingParticipant(null);
      setDeletePassword('');
      alert('참여자가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete participant:', error);
      alert('비밀번호가 일치하지 않거나 삭제에 실패했습니다.');
    }
  };

  const generateSettlementText = () => {
    if (!settlement) return '';

    let text = `📊 ${settlement.title}\n`;
    text += `생성일: ${new Date(settlement.createdAt).toLocaleString('ko-KR')}\n`;
    text += `\n`;
    
    text += `=== 항목 ===\n`;
    settlement.items.forEach(item => {
      text += `${item.category}: ${item.amount.toLocaleString()}원\n`;
    });
    text += `\n`;
    
    text += `=== 정산 결과 ===\n`;
    settlement.participants.forEach(participant => {
      const calculation = settlement.calculations[participant.name];
      const categories = Array.from(participant.participatedCategories).join(', ');
      const total = calculation ? Math.round(calculation.totalAmount) : 0;
      
      text += `\n${participant.name}\n`;
      text += `  참여: ${categories}\n`;
      
      if (calculation) {
        Object.entries(calculation.categoryAmounts).forEach(([cat, amt]) => {
          text += `  - ${cat}: ${Math.round(amt).toLocaleString()}원\n`;
        });
      }
      
      text += `  총 부담금: ${total.toLocaleString()}원\n`;
    });
    
    return text;
  };

    const copyResultToClipboard = async () => {
    const text = generateSettlementText();
    
    // 인앱 브라우저 감지
    const isInAppBrowser = /KAKAOTALK|NAVER|Line|Instagram|FBAV|FBAN/i.test(navigator.userAgent);
    
    // 모달 표시 함수
    const showTextModal = (copied = false) => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
      `;
      
      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      `;
      
      const title = document.createElement('h3');
      title.textContent = copied ? '✅ 복사 완료!' : '📋 정산 결과';
      title.style.cssText = `margin: 0 0 15px 0; color: ${copied ? '#4CAF50' : '#667eea'}; font-size: 22px; text-align: center;`;
      
      const desc = document.createElement('p');
      desc.textContent = '아래 내용을 공유하거나 저장하세요:';
      desc.style.cssText = 'color: #666; font-size: 15px; margin-bottom: 15px; text-align: center;';
      
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.readOnly = true;
      textarea.style.cssText = `
        width: 100%;
        height: 300px;
        padding: 14px;
        border: 2px solid #667eea;
        border-radius: 8px;
        font-size: 14px;
        font-family: monospace;
        background: #f8f9fa;
        color: #333;
        box-sizing: border-box;
        margin-bottom: 15px;
        resize: vertical;
        white-space: pre-wrap;
      `;
      
      setTimeout(() => {
        textarea.focus();
        textarea.select();
      }, 100);
      
      const copyBtn = document.createElement('button');
      copyBtn.textContent = copied ? '✅ 복사 완료' : '📋 다시 복사하기';
      copyBtn.disabled = copied;
      copyBtn.style.cssText = `
        width: 100%;
        padding: 14px;
        background: ${copied ? '#ccc' : '#667eea'};
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: ${copied ? 'default' : 'pointer'};
        margin-bottom: 10px;
      `;
      
      if (!copied) {
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(text);
            copyBtn.textContent = '✅ 복사 완료';
            copyBtn.disabled = true;
            copyBtn.style.background = '#4CAF50';
            copyBtn.style.cursor = 'default';
          } catch (error) {
            alert('복사에 실패했습니다. 텍스트를 직접 선택해서 복사해주세요.');
          }
        };
      }
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '닫기';
      closeBtn.style.cssText = `
        width: 100%;
        padding: 12px;
        background: #f0f0f0;
        color: #666;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        cursor: pointer;
      `;
      
      content.appendChild(title);
      content.appendChild(desc);
      content.appendChild(textarea);
      content.appendChild(copyBtn);
      content.appendChild(closeBtn);
      modal.appendChild(content);
      document.body.appendChild(modal);
      
      closeBtn.onclick = () => {
        document.body.removeChild(modal);
      };
      
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      };
    };
    
    // 인앱 브라우저면 경고 모달
    if (isInAppBrowser) {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
      `;
      
      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        padding: 25px;
        border-radius: 15px;
        max-width: 450px;
        width: 100%;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      `;
      
      const title = document.createElement('h3');
      title.textContent = '⚠️ 인앱 브라우저 감지';
      title.style.cssText = 'margin: 0 0 15px 0; color: #FF6B6B; font-size: 20px; text-align: center;';
      
      const desc = document.createElement('p');
      desc.innerHTML = '복사 기능이 제한될 수 있습니다.<br>외부 브라우저에서 열면 더 편리합니다.';
      desc.style.cssText = 'color: #666; font-size: 15px; margin-bottom: 20px; text-align: center; line-height: 1.6;';
      
      const instruction = document.createElement('div');
      instruction.innerHTML = `
        <div style="
          background: #FFF3CD;
          border: 2px solid #FFC107;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        ">
          <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: bold;">
            📱 외부 브라우저로 열기:
          </p>
          <ol style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.8;">
            <li>우측 상단 <strong>⋯</strong> (더보기) 클릭</li>
            <li><strong>"Safari로 열기"</strong> 또는<br><strong>"Chrome으로 열기"</strong> 선택</li>
            <li>외부 브라우저에서 복사!</li>
          </ol>
        </div>
      `;
      
      const tryBtn = document.createElement('button');
      tryBtn.textContent = '그래도 시도하기';
      tryBtn.style.cssText = `
        width: 100%;
        padding: 14px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        margin-bottom: 10px;
      `;
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '닫기';
      closeBtn.style.cssText = `
        width: 100%;
        padding: 12px;
        background: #ccc;
        color: #666;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        cursor: pointer;
      `;
      
      content.appendChild(title);
      content.appendChild(desc);
      content.appendChild(instruction);
      content.appendChild(tryBtn);
      content.appendChild(closeBtn);
      modal.appendChild(content);
      document.body.appendChild(modal);
      
      tryBtn.onclick = () => {
        document.body.removeChild(modal);
        showTextModal(false);
      };
      
      closeBtn.onclick = () => {
        document.body.removeChild(modal);
      };
      
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      };
      
      return;
    }
    
    // 일반 브라우저: 복사 시도
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (error) {
      console.log('Clipboard copy failed:', error);
    }
    
    // 모달 표시
    showTextModal(copied);
  };


  const downloadResultAsFile = () => {
    const text = generateSettlementText();
    
    // 카카오톡 인앱 브라우저 감지 및 경고
    const isKakaoTalk = /KAKAOTALK/i.test(navigator.userAgent);
    if (isKakaoTalk) {
      if (window.confirm('⚠️ 카카오톡 인앱 브라우저에서는 파일 다운로드가 제한될 수 있습니다.\n\n외부 브라우저(Safari, Chrome)에서 열어서 다운로드하는 것을 권장합니다.\n\n그래도 다운로드를 시도하시겠습니까?')) {
        // 계속 진행
      } else {
        return; // 취소
      }
    }
    
    // 모바일에서는 Web Share API 우선 사용
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [] })) {
      // File 객체 생성
      const file = new File([text], `${settlement.title}_정산결과.txt`, { type: 'text/plain' });
      
      navigator.share({
        title: settlement.title,
        text: '정산 결과',
        files: [file]
      }).catch((error) => {
        // 파일 공유 실패 시 텍스트만 공유 시도
        if (navigator.share) {
          navigator.share({
            title: settlement.title,
            text: text
          }).catch(() => {
            // 완전히 실패하면 다운로드 시도
            fallbackDownload(text);
          });
        } else {
          fallbackDownload(text);
        }
      });
    } else {
      fallbackDownload(text);
    }
  };
  
  const fallbackDownload = (text) => {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${settlement.title}_정산결과.txt`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // URL 해제는 약간 지연 후
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      alert('파일이 다운로드됩니다.');
    } catch (error) {
      // 완전히 실패하면 텍스트 표시
      alert('다운로드에 실패했습니다. 텍스트를 복사하세요.\n\n' + text);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="settlement-detail">
        <div className="settlement-header">
          <div className="header-left">
            <button onClick={() => navigate('/')} className="btn-home">
              🏠 메인으로
            </button>
            <h2>{settlement.title}</h2>
          </div>
          <div className="header-actions">
            <button onClick={copyInviteLink} className="btn-copy">👥 참여자 초대 링크</button>
            {!settlement.finalized && (
              <button onClick={openFinalizeModal} className="btn-finalize">
                계산하기
              </button>
            )}
          </div>
        </div>
        <p className="settlement-date">
          생성일: {new Date(settlement.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
          {settlement.finalized && <span className="finalized-badge"> • 계산 완료</span>}
        </p>
        
        {/* 참여 현황 */}
        <div className="participant-status">
          <span className="status-label">참여 현황:</span>
          <span className="status-value">
            <strong>{settlement.participants.length}</strong>
            {settlement.totalParticipants && (
              <span> / {settlement.totalParticipants}</span>
            )}
            명
          </span>
        </div>

        {/* 항목 표시 */}
        <div className="detail-section">
          <h3>항목</h3>
          <table className="detail-table">
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

        {/* 계산 완료 전: 참여자 추가 폼 + 현재 참여자 목록 */}
        {!settlement.finalized && (
          <>
            <div className="detail-section">
              <h3>참여하기</h3>
              <div className="participant-form">
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="이름"
                  className="participant-name-input"
                />
                <div className="category-checks">
                  {settlement.items.map((item) => (
                    <label key={item.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(item.category)}
                        onChange={() => toggleCategory(item.category)}
                      />
                      {item.category}
                    </label>
                  ))}
                </div>
                <button onClick={addParticipant} className="btn-add-participant">
                  참여자 추가
                </button>
              </div>
            </div>

            <div className="detail-section">
              <div className="section-header">
                <h3>현재 참여자</h3>
              </div>
              {settlement.participants.length === 0 ? (
                <p className="empty-message">아직 참여자가 없습니다.</p>
              ) : (
                <ul className="participant-list">
                  {settlement.participants.map(participant => (
                    <li key={participant.id} className="participant-item">
                      <div className="participant-info">
                        <strong>{participant.name}</strong>
                        <span className="participant-categories">
                          {Array.from(participant.participatedCategories).join(', ')}
                        </span>
                      </div>
                      <div className="participant-actions">
                        <button 
                          onClick={() => openEditModal(participant)} 
                          className="btn-edit-small"
                          title="편집"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => openDeleteModal(participant)} 
                          className="btn-delete-small"
                          title="삭제"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* 계산 완료 후: 최종 결과 */}
        {settlement.finalized && (
          <div className="detail-section">
            <div className="result-header">
              <h3>정산 결과</h3>
              <div className="result-actions">
                <button onClick={copyResultToClipboard} className="btn-copy-result">
                  📋 텍스트 복사
                </button>
                <button onClick={downloadResultAsFile} className="btn-download">
                  💾 파일 다운로드
                </button>
              </div>
            </div>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>참여 항목</th>
                  <th>정산 금액</th>
                </tr>
              </thead>
              <tbody>
                {settlement.participants.map(participant => {
                  const calculation = settlement.calculations[participant.name];
                  return (
                    <tr key={participant.id}>
                      <td>{participant.name}</td>
                      <td>
                        {Array.from(participant.participatedCategories).join(', ')}
                      </td>
                      <td className="amount-cell">
                        {calculation ? (
                          <>
                            <div className="category-breakdown">
                              {Object.entries(calculation.categoryAmounts).map(([cat, amt]) => (
                                <div key={cat} className="breakdown-item">
                                  {cat}: {Math.round(amt).toLocaleString()}원
                                </div>
                              ))}
                            </div>
                            <div className="total-amount">
                              총: {Math.round(calculation.totalAmount).toLocaleString()}원
                            </div>
                          </>
                        ) : '0원'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="total-settlement">
              <strong>총 정산금액:</strong>
              <span className="total-settlement-amount">
                {settlement.participants.reduce((total, participant) => {
                  const calculation = settlement.calculations[participant.name];
                  return total + (calculation ? calculation.totalAmount : 0);
                }, 0).toLocaleString()}원
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 계산하기 모달 */}
      {showFinalizeModal && (
        <div className="modal-overlay" onClick={() => setShowFinalizeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>계산 완료</h3>
            <p>정산을 완료하려면 비밀번호를 입력하세요.</p>
            <p className="warning-text">⚠️ 계산 완료 후에는 참여자를 추가할 수 없습니다.</p>
            <input
              type="password"
              value={finalizePassword}
              onChange={(e) => setFinalizePassword(e.target.value)}
              placeholder="비밀번호"
              onKeyPress={(e) => e.key === 'Enter' && finalizeSettlement()}
            />
            <div className="modal-actions">
              <button onClick={finalizeSettlement} className="btn-primary">확인</button>
              <button onClick={() => setShowFinalizeModal(false)} className="btn-secondary">
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 참여자 편집 모달 */}
      {showEditModal && editingParticipant && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>참여자 편집</h3>
            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="이름"
              />
            </div>
            <div className="form-group">
              <label>참여 항목</label>
              <div className="category-checks">
                {settlement.items.map((item) => (
                  <label key={item.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editCategories.has(item.category)}
                      onChange={() => toggleEditCategory(item.category)}
                    />
                    {item.category}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="정산 생성 시 입력한 비밀번호"
                onKeyPress={(e) => e.key === 'Enter' && updateParticipant()}
              />
            </div>
            <div className="modal-actions">
              <button onClick={updateParticipant} className="btn-primary">수정</button>
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 참여자 삭제 모달 */}
      {showDeleteModal && deletingParticipant && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>참여자 삭제</h3>
            <p><strong>{deletingParticipant.name}</strong>을(를) 삭제하시겠습니까?</p>
            <p className="warning-text">⚠️ 삭제 후에는 복구할 수 없습니다.</p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="비밀번호"
              onKeyPress={(e) => e.key === 'Enter' && deleteParticipant()}
            />
            <div className="modal-actions">
              <button onClick={deleteParticipant} className="btn-danger">삭제</button>
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

export default SettlementPage;
