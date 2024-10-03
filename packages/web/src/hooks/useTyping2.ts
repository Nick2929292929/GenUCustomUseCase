import { useEffect, useMemo, useState } from 'react';

const TYPING_DELAY = 10;

const useTyping2 = (typing?: boolean) => {
  const [typingTextInput2, setTypingTextInput2] = useState('');
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const [animating2, setAnimating2] = useState(false);

  useEffect(() => {
    if (typing) {
      // アニメーション開始時
      if (!animating2) {
        setAnimating2(true);
      }
    } else {
      // アニメーション完了時 or 最初からアニメーションがないと指定された時
      if (!animating2) {
        setCurrentIndex2(0);
      }
    }
  }, [typing, animating2, setAnimating2, setCurrentIndex2]);

  // 入力が必要な残りの文字列数
  const remainingTextLength = useMemo(() => {
    return typingTextInput2.length - currentIndex2;
  }, [currentIndex2, typingTextInput2]);

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
    if (animating2 && currentIndex2 <= typingTextInput2.length + 1) {
      const timeout = setTimeout(() => {
        if (currentIndex2 < typingTextInput2.length + 1) {
          setCurrentIndex2(currentIndex2 + inputUnit);
        } else {
          // 入力文字列の末尾に追いついた時に typing が false になっていたらアニメーションを終了
          if (!typing) {
            setAnimating2(false);
          }
        }
      }, TYPING_DELAY);

      return () => clearTimeout(timeout);
    }
  }, [
    typingTextInput2,
    currentIndex2,
    animating2,
    typing,
    setCurrentIndex2,
    setAnimating2,
    inputUnit,
  ]);

  const typingTextOutput2 = useMemo(() => {
    if (animating2) {
      return typingTextInput2.slice(0, currentIndex2);
    } else {
      // animating が false の場合は typingTextInput をそのまま返す
      return typingTextInput2;
    }
  }, [typingTextInput2, currentIndex2, animating2]);

  return {
    setTypingTextInput2,
    typingTextOutput2,
  };
};

export default useTyping2;
