import axios from "axios";
import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import VoiceTest from "../VoiceTest";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const PhoneForm = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray950};
  font-weight: 500;
`;

const PhoneInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  font-size: 16px;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.gray500};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${({ theme }) => theme.colors.gray950};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray400};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 14px;
  margin: 4px 0 0;
`;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  

  // 전화번호 형식 검증
  const isValidPhoneNumber = (phone: string) => {
    const regex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    return regex.test(phone.replace(/-/g, ""));
  };

  // 하이픈 자동 추가
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedNumber = formatPhoneNumber(value);
    setPhoneNumber(formattedNumber);
    
    if (value && !isValidPhoneNumber(formattedNumber)) {
      setError("올바른 전화번호 형식이 아닙니다");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("올바른 전화번호를 입력해주세요");
      return;
    }
    const response = await axios.post("/api/member/login", {
      phone: phoneNumber
    })

    if(response.status === 200) {
      localStorage.setItem("phone", phoneNumber)
      alert("인증번호가 발송되었습니다.")
    }
  };

  return (
    <Container>
      <PhoneForm onSubmit={handleSubmit}>
        <Label htmlFor="phone">전화번호</Label>
        <PhoneInput
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="전화번호를 입력해주세요"
          maxLength={13}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton 
          type="submit" 
          disabled={!phoneNumber || !!error}
        >
          확인
        </SubmitButton>
      </PhoneForm>

      <VoiceTest />
    </Container>
  );
};

export default Login;