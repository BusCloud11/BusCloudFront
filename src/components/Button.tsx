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
      ? props.theme.colors.orange04
      : props.theme.colors.gray800};
  background-color: ${(props) =>
    props.variant === "primary"
      ? props.theme.colors.orange03
      : props.variant === "secondary"
      ? props.theme.colors.orange01
      : "#ffffff"};

  font-size: ${(props) =>
    props.variant === "primary"
      ? "16px"
      : props.variant === "secondary"
      ? "16px"
      : "14px"};
  font-weight: "semibold";
  border: none;
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
      ? "48px"
      : "40px"};
  width: ${(props) =>
    props.size === "large"
      ? "100%"
      : props.size === "medium"
      ? "128px"
      : "114px"};

  &:hover {
    background-color: ${(props) =>
      !props.disabled &&
      (props.variant === "primary"
        ? props.theme.colors.orange04
        : props.variant === "secondary"
        ? props.theme.colors.orange02
        : "#f1f1f4")};
  }

  &:active {
    background-color: ${(props) =>
      !props.disabled &&
      (props.variant === "primary"
        ? props.theme.colors.orange04
        : props.variant === "secondary"
        ? props.theme.colors.orange02
        : "#f1f1f4")};
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  size = "medium",
  variant = "primary",
  disabled = false,
  onClick,
}) => {
  return (
    <Btn size={size} variant={variant} disabled={disabled} onClick={onClick}>
      {children}
    </Btn>
  );
};

export default Button;
