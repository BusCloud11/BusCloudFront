import styled from "styled-components";

interface ButtonProps {
  size?: "large" | "medium" | "small";
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Btn = styled.button<ButtonProps>`
  color: ${(props) =>
    props.variant === "primary"
      ? "#ffffff"
      : props.variant === "secondary"
      ? props.theme.colors.gray50
      : props.theme.colors.gray800};
  background-color: ${(props) =>
    props.variant === "primary"
      ? props.theme.colors.orange03
      : props.variant === "secondary"
      ? props.theme.colors.gray800
      : "props.theme.colors.gray50"};

  font-size: ${(props) =>
    props.variant === "primary"
      ? "16px"
      : props.variant === "secondary"
      ? "16px"
      : "14px"};
  font-weight: "semibold";
  border: ${(props) =>
    props.variant === "tertiary" ? "1px solid #e0e0e3" : "none"};
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  height: ${(props) =>
    props.size === "large"
      ? "52px"
      : props.size === "medium"
      ? "52px"
      : "52px"};
  width: ${(props) =>
    props.size === "large"
      ? "100%"
      : props.size === "medium"
      ? "200px"
      : "98px"};

  &:hover {
    background-color: ${(props) =>
      !props.disabled &&
      (props.variant === "primary"
        ? props.theme.colors.orange04
        : props.variant === "secondary"
        ? props.theme.colors.gray900
        : "#f1f1f4")};
  }

  &:active {
    background-color: ${(props) =>
      !props.disabled &&
      (props.variant === "primary"
        ? props.theme.colors.orange04
        : props.variant === "secondary"
        ? props.theme.colors.gray900
        : "#f1f1f4")};
  }
`;

const Button = ({
  children,
  size = "medium",
  variant = "primary",
  disabled = false,
  onClick,
}: ButtonProps) => {
  return (
    <Btn size={size} variant={variant} disabled={disabled} onClick={onClick}>
      {children}
    </Btn>
  );
};

export default Button;
