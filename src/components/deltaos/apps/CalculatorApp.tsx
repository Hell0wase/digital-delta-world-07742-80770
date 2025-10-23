import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CalculatorAppProps {
  themeMode: 'dark' | 'light';
}

export const CalculatorApp = ({ themeMode }: CalculatorAppProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op: string) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;

    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = previousValue + current;
        break;
      case '-':
        result = previousValue - current;
        break;
      case '*':
        result = previousValue * current;
        break;
      case '/':
        result = previousValue / current;
        break;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  return (
    <div className="p-8 max-w-md mx-auto h-full flex flex-col justify-center">
      <div className="bg-muted/50 backdrop-blur-xl rounded-2xl p-6 mb-6 text-right">
        <div className="text-4xl font-light tracking-wide min-h-[60px] flex items-center justify-end">
          {display}
        </div>
      </div>
      <div className="space-y-3">
        {buttons.map((row, i) => (
          <div key={i} className="flex gap-3">
            {row.map((btn) => {
              const isOperator = ['+', '-', '*', '/', '='].includes(btn);
              const buttonStyle = themeMode === 'dark' 
                ? { 
                    backgroundColor: isOperator ? '#4a5568' : 'transparent',
                    color: '#ffffff',
                    border: isOperator ? 'none' : '1px solid rgba(255,255,255,0.2)'
                  }
                : {
                    backgroundColor: isOperator ? '#e2e8f0' : 'transparent',
                    color: '#000000',
                    border: isOperator ? 'none' : '1px solid rgba(0,0,0,0.2)'
                  };
              
              return (
                <Button
                  key={btn}
                  onClick={() => {
                    if (btn === '=') handleEquals();
                    else if (['+', '-', '*', '/'].includes(btn)) handleOperation(btn);
                    else handleNumber(btn);
                  }}
                  className="flex-1 h-16 text-2xl font-light rounded-xl"
                  style={buttonStyle}
                >
                  {btn}
                </Button>
              );
            })}
          </div>
        ))}
        <Button onClick={handleClear} variant="destructive" className="w-full h-16 text-xl rounded-xl">
          Clear
        </Button>
      </div>
    </div>
  );
};
