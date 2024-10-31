import React, { useEffect, useRef, useState } from "react";

import styled from "styled-components";

interface AdjustInputProps {
  value: string;
  placeholder: string;
  additionalText: string;
  onFocus?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${(props) => props.theme.text.h1bd32.fontSize};
  font-weight: ${(props) => props.theme.text.h1bd32.fontWeight};
`;

const Input = styled.input<{ width: number }>`
  ${({ width }) => `width: ${width}px;`}
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.gray900};
  background-color: ${(props) => props.theme.colors.gray50};
  font-size: ${(props) => props.theme.text.h1bd32.fontSize};
  font-weight: ${(props) => props.theme.text.h1bd32.fontWeight};
  border: none;
  text-align: center;
  outline: none;
  &::placeholder {
    color: ${(props) => props.theme.colors.gray500};
  }
`;

const InputMirror = styled.div`
  position: absolute;
  visibility: hidden;
  height: 0;
  font-size: ${(props) => props.theme.text.h1bd32.fontSize};
  font-weight: ${(props) => props.theme.text.h1bd32.fontWeight};
`;

export const AdjustInput = ({
  value,
  placeholder,
  additionalText,
  onFocus,
  onChange,
}: AdjustInputProps) => {
  const [width, setWidth] = useState(0);
  const mirrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mirrorRef.current) return;
    setWidth(mirrorRef.current.clientWidth);
  }, [value, placeholder]);

  return (
    <Container>
      <div>
        <Input
          width={width + 8}
          value={value}
          placeholder={placeholder}
          onFocus={onFocus}
          onChange={onChange}
          id={placeholder === "성산일출봉" ? "originInput" : ""}
        />
        <span>{additionalText}</span>
      </div>
      <InputMirror ref={mirrorRef} aria-hidden>
        {value || placeholder}
      </InputMirror>
    </Container>
  );
};
