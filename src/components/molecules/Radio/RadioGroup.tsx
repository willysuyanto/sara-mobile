import type { ReactNode } from 'react';

import { createContext, useCallback, useMemo } from 'react';
type Properties = {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onChange?: (value: string) => void;
  readonly value?: string;
};

type RadioGroupContextValue = {
  readonly disabled: boolean;
  readonly onChange: (value: string) => void;
  readonly value?: string;
};

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(
  undefined,
);

/**
 * Shares the selected `value` with the `Radio` children so a group behaves as a
 * single-selection control.
 */
function RadioGroup({
  children,
  disabled = false,
  onChange = undefined,
  value = undefined,
}: Properties) {
  const handleChange = useCallback(
    (next: string) => {
      onChange?.(next);
    },
    [onChange],
  );

  const contextValue = useMemo(
    () => ({ disabled, onChange: handleChange, value }),
    [disabled, handleChange, value],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      {children}
    </RadioGroupContext.Provider>
  );
}

export { RadioGroupContext };
export default RadioGroup;
