import React, { InputHTMLAttributes } from "react";

import icCancel from "../assets/icCancel.svg";
import styled from "styled-components";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: boolean;
  value: string;
  onClear?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Label = styled.label`
  color: ${(props) => props.theme.colors.gray600};
  font-size: ${(props) => props.theme.text.t2rg18.fontSize};
  font-weight: ${(props) => props.theme.text.t2rg18.fontWeight};
  line-height: ${(props) => props.theme.text.t2rg18.lineHeight};
`;

const HelperText = styled.span<{ error?: boolean }>`
  color: ${(props) =>
    props.error ? props.theme.colors.redStrong : props.theme.colors.gray600};
  font-size: ${(props) => props.theme.text.t2rg18.fontSize};
  font-weight: ${(props) => props.theme.text.t2rg18.fontWeight};
  line-height: ${(props) => props.theme.text.t2rg18.lineHeight};
`;

const InputWrapper = styled.div<{
  focused: boolean;
  error?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  border: 1px solid
    ${(props) =>
      props.error
        ? props.theme.colors.redStrong
        : props.focused
        ? props.theme.colors.orange03
        : props.theme.colors.gray50};
  background-color: ${(props) =>
    props.disabled ? props.theme.colors.gray50 : props.theme.colors.gray100};
  padding: 12px;
  border-radius: 12px;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${(props) => !props.disabled && props.theme.colors.orange03};
  }
`;

const StyledInput = styled.input<{ disabled?: boolean }>`
  font-size: ${(props) => props.theme.text.b2rg22.fontSize};
  font-weight: ${(props) => props.theme.text.b2rg22.fontWeight};
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  color: ${(props) =>
    props.disabled ? props.theme.colors.gray200 : props.theme.colors.gray950};

  &::placeholder {
    color: ${(props) => props.theme.colors.gray600};
    font-size: ${(props) => props.theme.text.b2rg22.fontSize};
    font-weight: ${(props) => props.theme.text.b2rg22.fontWeight};
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.gray600};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  border-radius: 50%;
`;

const TextInput = ({
  label,
  helperText,
  error = false,
  value,
  onClear,
  onChange,
  disabled = false,
  ...props
}: InputProps) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <Wrapper>
      <Label>{label}</Label>
      <InputWrapper focused={focused} error={error} disabled={disabled}>
        <StyledInput
          {...props}
          value={value}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
        />
        {value && onClear && !disabled && (
          <ClearButton onClick={onClear} aria-label="Clear input">
            <img src={icCancel} />
          </ClearButton>
        )}
      </InputWrapper>
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </Wrapper>
  );
};

export default TextInput;
