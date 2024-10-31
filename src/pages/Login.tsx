import { ChangeEvent, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import icDropDown from "../assets/icDropDown.svg";
import Button from "../components/Button";
import Checkbox from "../components/CheckBox";
import TextInput from "../components/TextInput";
import { postMemberLogin } from "../utils/post-member-login";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 0 16px;
  gap: 32px;
`;

const Logo = styled.div`
  width: 289px;
  height: 213px;
  margin-top: 65px;
  margin-bottom: 40px;
  background-color: #353535;
`;

const CheckArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 12px;
  font-size: ${(props) => props.theme.text.t1md20.fontSize};
  font-weight: ${(props) => props.theme.text.t1md20.fontWeight};
  line-height: ${(props) => props.theme.text.t1md20.lineHeight};

  & > img {
    position: absolute;
    right: 8px;
  }
`;

const Login = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isCheck1, setIsCheck1] = useState(false);
  const [isCheck2, setIsCheck2] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    setBtnDisabled(!isValidPhoneNumber(phone) || !isCheck1 || !isCheck2);
  }, [phone, isCheck1, isCheck2]);

  const isValidPhoneNumber = (phoneNumber: string) => {
    const regex = /^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/;
    return regex.test(phoneNumber.replace(/-/g, ""));
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedNumber = formatPhoneNumber(value);
    setPhone(formattedNumber);
  };

  const handleSubmit = async () => {
    if (phone && !isValidPhoneNumber(phone)) {
      setError("올바른 전화번호 형식이 아닙니다");
      return;
    }
    
    try {
      const token = await postMemberLogin(phone)
      localStorage.setItem('accessToken', token)
      localStorage.setItem('phone', phone)
      navigate('/home')
    } catch {
      alert("로그인에 실패했습니다.")
    }
  };

  return (
    <Container>
      <Logo />
      <TextInput
        label="휴대폰 로그인"
        value={phone}
        placeholder="010-1234-5678"
        type="tel"
        onChange={handlePhoneChange}
        onClear={() => {
          setPhone("");
        }}
        error={!!error}
        helperText={error}
      />
      <CheckArea>
        <Checkbox
          checked={isCheck1}
          onToggle={() => {
            setIsCheck1((prev) => !prev);
          }}
        />
        <span>[필수] 개인정보 수집 및 이용에 동의</span>
        <img src={icDropDown} />
      </CheckArea>
      <CheckArea>
        <Checkbox
          checked={isCheck2}
          onToggle={() => {
            setIsCheck2((prev) => !prev);
          }}
        />
        <span>[필수] 서비스 악용 방지 및 처벌 동의</span>
        <img src={icDropDown} />
      </CheckArea>
      <Button size="large" onClick={handleSubmit} disabled={btnDisabled}>
        시작하기
      </Button>
    </Container>
  );
};

export default Login;
