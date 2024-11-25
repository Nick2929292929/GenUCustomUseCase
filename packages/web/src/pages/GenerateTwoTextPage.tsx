import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import Markdown from '../components/Markdown';
import ButtonCopy from '../components/ButtonCopy';
import Select from '../components/Select2';
import useChat from '../hooks/useChat';
import useChat2 from '../hooks/useChat';
import useChat3 from '../hooks/useChat';
import useTyping from '../hooks/useTyping';
import useTyping2 from '../hooks/useTyping2';
import useTyping3 from '../hooks/useTyping3';
import { create } from 'zustand';
import { GenerateTwoTextPageParams } from '../@types/navigate';
import { MODELS } from '../hooks/useModel';
import { getPrompter } from '../prompts';
import queryString from 'query-string';

type StateType = {
  information: string;
  setInformation: (s: string) => void;
  context: string;
  setContext: (s: string) => void;
  text: string;
  text2: string;
  text3: string;
  setText: (s: string) => void;
  setText2: (s: string) => void;
  setText3: (s: string) => void;
  clear: () => void;
};

const useGenerateTwoTextPageState = create<StateType>((set) => {
  const INIT_STATE = {
    information: '',
    context: '',
    text: '',
    text2: '',
    text3: '',
  };
  return {
    ...INIT_STATE,
    setInformation: (s: string) => {
      set(() => ({
        information: s,
      }));
    },
    setContext: (s: string) => {
      set(() => ({
        context: s,
      }));
    },
    setText: (s: string) => {
      set(() => ({
        text: s,
      }));
    },
    setText2: (s: string) => {
      set(() => ({
        text2: s,
      }));
    },
    setText3: (s: string) => {
      set(() => ({
        text3: s,
      }));
    },
    clear: () => {
      set(INIT_STATE);
    },
  };
});

const GenerateTwoTextPage: React.FC = () => {
  const {
    information,
    setInformation,
    context,
    setContext,
    text,
    text2,
    text3,
    setText,
    setText2,
    setText3,
    clear,
  } = useGenerateTwoTextPageState();
  const { pathname, search } = useLocation();
  const {
    getModelId: getModelId2,
    setModelId: setModelId2,
    loading,
    messages,
    postChat,
    continueGeneration,
    clear: clearChat,
    updateSystemContextByModel,
    getStopReason,
  } = useChat2(pathname);
  const {
    getModelId,
    setModelId,
    loading: loading2,
    messages: messages2,
    postChat: postChat2,
    //continueGeneration: continueGeneration2,
    //clear: clearChat2,
    //updateSystemContextByModel: updateSystemContextByModel2,
    //getStopReason: getStopReason2,
  } = useChat("twochat2");
  const {
    getModelId: getModelId3,
    setModelId: setModelId3,
    loading: loading3,
    messages: messages3,
    postChat: postChat3,
    //continueGeneration: continueGeneration2,
    //clear: clearChat2,
    //updateSystemContextByModel: updateSystemContextByModel2,
    //getStopReason: getStopReason2,
  } = useChat3("twochat3");
  const { setTypingTextInput, typingTextOutput } = useTyping(loading);
  const { setTypingTextInput2, typingTextOutput2 } = useTyping2(loading2);
  const { setTypingTextInput3, typingTextOutput3 } = useTyping3(loading3);
  const { modelIds: availableModels } = MODELS;
  //const { modelIds2: availableModels2} = MODELS;
  const modelId = getModelId();
  const modelId2 = getModelId2();
  const modelId3 = getModelId3();
  const prompter = useMemo(() => {
    return getPrompter(modelId);
  }, [modelId]);
  const prompter2 = useMemo(() => {
    return getPrompter(modelId2);
  }, [modelId2]);
  const prompter3 = useMemo(() => {
    return getPrompter(modelId3);
  }, [modelId3]);
  const stopReason = getStopReason();

  useEffect(() => {
    updateSystemContextByModel();
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [prompter]);
  useEffect(() => {
    updateSystemContextByModel();
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [prompter2]);
  useEffect(() => {
    updateSystemContextByModel();
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [prompter3]);

  const disabledExec = useMemo(() => {
    return information === '' || loading;
  }, [information, loading]);

  useEffect(() => {
    const _modelId = !modelId ? availableModels[2] : modelId;
    if (search !== '') {
      const params = queryString.parse(search) as GenerateTwoTextPageParams;
      setInformation(params.information ?? '');
      setContext(params.context ?? '');

      setModelId(
        availableModels.includes(params.modelId ?? '')
          ? params.modelId!
          : _modelId
      );
    } else {
      setModelId(_modelId);
    }
    const _modelId2 = !modelId2 ? availableModels[1] : modelId2;
    if (search !== '') {
      const params = queryString.parse(search) as GenerateTwoTextPageParams;

      setModelId2(
        availableModels.includes(params.modelId2 ?? '')
          ? params.modelId2!
          : _modelId2
      );
    } else {
      setModelId2(_modelId2);
    }

    const _modelId3 = !modelId3 ? availableModels[5] : modelId3;
    if (search !== '') {
      const params = queryString.parse(search) as GenerateTwoTextPageParams;

      setModelId3(
        availableModels.includes(params.modelId3 ?? '')
          ? params.modelId3!
          : _modelId3
      );
    } else {
      setModelId3(_modelId3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setInformation, setContext, modelId,modelId2,modelId3, availableModels, search]);

  useEffect(() => {
    setTypingTextInput(text);
  }, [text, setTypingTextInput]);
  useEffect(() => {
    setTypingTextInput2(text2);
  }, [text2, setTypingTextInput2]);
  useEffect(() => {
    setTypingTextInput3(text3);
  }, [text3, setTypingTextInput3]);

  const getGeneratedTwoText = (information: string, context: string) => {
    postChat(
      prompter.generateTwoTextPagePrompt({
        information,
        context,
      }),
      true
    );
  }
  const getGeneratedTwoText2 = (information: string, context: string) => {

    postChat2(
     prompter2.generateTwoTextPagePrompt({
        information,
        context,
      }),
      true
    );
  };
  const getGeneratedTwoText3 = (information: string, context: string) => {

    postChat3(
     prompter3.generateTwoTextPagePrompt({
        information,
        context,
      }),
      true
    );
  };

  // リアルタイムにレスポンスを表示
  useEffect(() => {
    if (messages.length === 0) return;
    if (messages2.length === 0) return;
    if (messages3.length === 0) return;
    const _lastMessage = messages[messages.length - 1];
    const _lastMessage2 = messages2[messages2.length - 1];
    const _lastMessage3 = messages3[messages3.length - 1];
    if (_lastMessage.role !== 'assistant') return;
    if (_lastMessage2.role !== 'assistant') return;
    if (_lastMessage3.role !== 'assistant') return;
    const _response = messages[messages.length - 1].content;
    const _response2 = messages2[messages2.length - 1].content;
    const _response3 = messages3[messages3.length - 1].content;
    setText(_response.trim());
    setText2(_response2.trim());
    setText3(_response3.trim());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, messages2,messages3]);

  // 要約を実行
  const onClickExec = useCallback(() => {
    if (loading) return;
    getGeneratedTwoText(information, context);
    if (loading2) return;
    getGeneratedTwoText2(information, context);
    if (loading3) return;
    getGeneratedTwoText3(information, context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [information, context, loading, loading2, loading3]);
    

  // リセット
  const onClickClear = useCallback(() => {
    clear();
    clearChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ModelPDStyle = {
    fontSize: '16px'
  };

  return (
    <div className="grid grid-cols-12">
      <div className="invisible col-span-12 my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min print:visible print:my-5 print:h-min">
        3つのLLMを用いた文章生成
      </div>
      <div className="col-span-12 col-start-1 mx-0 lg:col-span-12 lg:col-start-1 xl:col-span-12 xl:col-start-1">
        <Card label='文章のもとになる情報'>
        <div className="py-2.5">
          生成する文章の内容を入力してください
          <Textarea
            placeholder="入力してください"
            value={information}
            onChange={setInformation}
            maxHeight={-1}
            className="text-aws-font-color"
          />
          文章の形式を入力してください
          <Textarea
            placeholder="文章の形式を指示してください。(マークダウン、ブログ、ビジネスメールなど)"
            value={context}
            onChange={setContext}
          />

          <div className="flex justify-end gap-3">
            {stopReason === 'max_tokens' && (
              <Button onClick={continueGeneration}>続きを出力</Button>
            )}

            <Button outlined onClick={onClickClear} disabled={disabledExec}>
              クリア
            </Button>

            <Button disabled={disabledExec} onClick={onClickExec}>
              実行
            </Button>
          </div>       
        </div>
        </Card>


          
          

          <div className="grid grid-cols-3 gap-1">
            <Card>
              <div className="mb-2 flex w-full" >
                <div style={ModelPDStyle}>
                  <Select
                    value={modelId2}
                    onChange={setModelId2}
                    options={availableModels.map((m) => {
                    return { value: m, label: m };
                    })}
                  />
                
                </div>

              </div>
              <div className="mt-5 rounded border border-black/30 p-1.5">
          
                <Markdown>{typingTextOutput}</Markdown>
                {!loading && text === '' && (
                  <div className="text-gray-500">
                    生成された文章がここに表示されます
                  </div>
                )}
                {loading && (
                  <div className="border-aws-sky size-5 animate-spin rounded-full border-4 border-t-transparent"></div>
                )}
            
                <div className="flex w-full justify-end">
                  <ButtonCopy text={text} interUseCasesKey="text"></ButtonCopy>
                </div>
              </div>
            </Card>
            <Card>
              <div className="mb-2 flex w-full">
                <Select
                  value={modelId}
                  onChange={setModelId}
                  options={availableModels.map((m) => {
                    return { value: m, label: m };
                })}
                className="text-sm"
                />
              </div>
              <div className="mt-5 rounded border border-black/30 p-1.5">
          
                <Markdown>{typingTextOutput2}</Markdown>
                {!loading2 && text2 === '' && (
                  <div className="text-gray-500">
                    生成された文章がここに表示されます
                  </div>
                )}
                {loading2 && (
                  <div className="border-aws-sky size-5 animate-spin rounded-full border-4 border-t-transparent"></div>
                )}
            
                <div className="flex w-full justify-end">
                  <ButtonCopy text={text2} interUseCasesKey="text"></ButtonCopy>
                </div>
              </div>
            </Card>
            <Card>
              <div className="mb-2 flex w-full">
              <Select
                value={modelId3}
                onChange={setModelId3}
                options={availableModels.map((m) => {
                  return { value: m, label: m };
                })}
                className="text-sm"
              />
            </div>

              <div className="mt-5 rounded border border-black/30 p-1.5">
          
                <Markdown>{typingTextOutput3}</Markdown>
                {!loading3 && text3 === '' && (
                  <div className="text-gray-500">
                    生成された文章がここに表示されます
                  </div>
                )}
                {loading3 && (
                  <div className="border-aws-sky size-5 animate-spin rounded-full border-4 border-t-transparent"></div>
                )}
            
                <div className="flex w-full justify-end">
                 <ButtonCopy text={text3} interUseCasesKey="text"></ButtonCopy>
                </div>
             </div>
            </Card>
          </div>
      </div>
    </div>
  );
};

export default GenerateTwoTextPage;
