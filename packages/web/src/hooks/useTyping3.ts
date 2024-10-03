import { useEffect, useMemo, useState } from 'react';

const TYPING_DELAY = 10;

const useTyping3 = (typing?: boolean) => {
  const [typingTextInput3, setTypingTextInput3] = useState('');
  const [currentIndex3, setCurrentIndex3] = useState(0);
  const [animating3, setAnimating3] = useState(false);

  useEffect(() => {
    if (typing) {
      // アニメーション開始時
      if (!animating3) {
        setAnimating3(true);
      }
    } else {
      // アニメーション完了時 or 最初からアニメーションがないと指定された時
      if (!animating3) {
        setCurrentIndex3(0);
      }
    }
  }, [typing, animating3, setAnimating3, setCurrentIndex3]);

  // 入力が必要な残りの文字列数
  const remainingTextLength = useMemo(() => {
    return typingTextInput3.length - currentIndex3;
  }, [currentIndex3, typingTextInput3]);

  // 一度に入力する文字列の単位
  const inputUnit = useMemo(() => {
    // タイピング中は残りの文字列数に応じて入力文字列数を変化させる
    // 入力文字数の単位は最大でも 10 文字とする
    if (typing) {
      return Math.min(Math.floor(remainingTextLength / 10) + 1, 10);
    } else {
      // タイピング中ではない場合は 10 文字を 1 単位で入力する (最速で入力する)
      return 10;
    }
  }, [typing, remainingTextLength]);

  useEffect(() => {
    if (animating3 && currentIndex3 <= typingTextInput3.length + 1) {
      const timeout = setTimeout(() => {
        if (currentIndex3 < typingTextInput3.length + 1) {
          setCurrentIndex3(currentIndex3 + inputUnit);
        } else {
          // 入力文字列の末尾に追いついた時に typing が false になっていたらアニメーションを終了
          if (!typing) {
            setAnimating3(false);
          }
        }
      }, TYPING_DELAY);

      return () => clearTimeout(timeout);
    }
  }, [
    typingTextInput3,
    currentIndex3,
    animating3,
    typing,
    setCurrentIndex3,
    setAnimating3,
    inputUnit,
  ]);

  const typingTextOutput3 = useMemo(() => {
    if (animating3) {
      return typingTextInput3.slice(0, currentIndex3);
    } else {
      // animating が false の場合は typingTextInput をそのまま返す
      return typingTextInput3;
    }
  }, [typingTextInput3, currentIndex3, animating3]);

  return {
    setTypingTextInput3,
    typingTextOutput3,
  };
};

export default useTyping3;
