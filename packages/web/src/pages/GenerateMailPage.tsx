import React, { useCallback, useEffect, useMemo, useState} from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import Markdown from '../components/Markdown';
import ButtonCopy from '../components/ButtonCopy';
import Select from '../components/Select';
import useChat from '../hooks/useChat';
import useTyping from '../hooks/useTyping';
import { create } from 'zustand';
import { GenerateMailPageLocationState } from '../@types/navigate';
import { MODELS } from '../hooks/useModel';
import { getPrompter } from '../prompts';
import queryString from 'query-string';
//import {useChat1, useChat2} from '../hooks/useChat12';


interface Option {
  value: string;
  label: string;
}
interface Radio {
    label: string
    value: string
}
const radiobuttons: Radio[] = [
  {
    label: "専門的な",
    value: "専門的"
  },
  {
    label: "親切な",
    value: "親切"
  },
  {
    label: "フォーマルな",
    value: "フォーマル"
  }
]
const mailtypelist: Option[] = [
  { value: '紹介メール', label: '紹介メール' },
  { value: 'セミナー案内メール', label: 'セミナー案内メール' },
];
const servicelist: Option[] = [
  { value: 'AWS DevOps導入支援サービス', label: 'AWS DevOps導入支援サービス'},
  { value: '生成AIPoc支援サービス', label: '生成AIPoc支援サービス'},
]
const languagelist: Option[] = [
  { value: '日本語', label: '日本語'},
  { value: '英語', label: '英語'},
]
const wordcountlist: Option[] = [
  { value: '200', label: '200'},
  { value: '500', label: '500'},
  { value: '1000', label: '1000'},
]
const subjectcountlist: Option[] = [
  { value: '3', label: '3'},
  { value: '5', label: '5'},
  { value: '7', label: '7'},
]

type StateType = {
  information: string;
  setInformation: (s: string) => void;
  context: string;
  setContext: (s: string) => void;
  text: string;
  setText: (s: string) => void;
  mailtype: string;
  //setIndustry: (s: string) => void;
  service: string;
  //setService: (s: string) => void;
  requirement: string;
  setRequirement: (s: string) => void;
  transmission: string;
  setTransmission: (s: string) => void;
  writingstyle: string;
  //setWritingstyle: (s: string) => void;
  wordcount: string;
  //setWordcount: (s: string) => void;
  subjectcount: string;
  selected: string;
  clear: () => void;
};

const useGenerateMailPageState = create<StateType>((set) => {
  const INIT_STATE = {
    information: '',
    context: '中身の内容をほのめかし、開封を促す、好奇心を刺激する。',
    text: '',
    mailtype: '',
    service: '',
    requirement: '箇条書きを使用して重要なポイントを明示し、メール本文の最後に、読者にホームページのアクセスを促す行動喚起を含めてください。',
    transmission: '顧客になぜぴったりなのかを説明し、利点があればそれも含めてください。',
    writingstyle: '',
    wordcount: '',
    subjectcount: '',
    industry: '',
    selected: '',

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
    
    //setService: (s: string) => {
    //  set(() => ({
    //    service: s,
    //  }));
    //},
    setRequirement: (s: string) => {
      set(() => ({
        requirement: s,
      }));
    },
    setTransmission: (s: string) => {
      set(() => ({
        transmission: s,
      }));
    },
   // setWritingstyle: (s: string) => {
    // set(() => ({
    //    writingstyle: s,
   //   }));
   // },
    //setWordcount: (s: string) => {
   //set(() => ({
    //    wordcount: s,
     // }));
    //},
    clear: () => {
      set(INIT_STATE);
    },
  };
});

//const vlu = "value";
//const [items, setItems] = useState([
//  {value: 'AAA', label: 'AAAA'},
//  {value: 'BBB', label: 'BBBB'},
//  {value: 'CCC', label: 'BBBB'}

//]);
  

////
//const [selectedValue2, setSelectedValue2] = useState('');
//const options = ['AAA','BBB','CCC'];
//
//const handleChange = (value: string) => {
//  setSelectedValue2(value);
//}
//
  // 選択された値を管理するための状態
//  const [selectedValue, setSelectedValue] = useState<string>('');

//DropDown

    
///
const GenerateMailPage: React.FC = () => {
  const {
    information,
    setInformation,
    context,
    setContext,
    //industry,
    //setIndustry,
    //service,
    //setService,
    requirement,
    setRequirement,
    transmission,
    setTransmission,
    //writingstyle,
    //setWritingstyle,
    //wordcount,
    //setWordcount,
    text,
    setText,
    clear,
  } = useGenerateMailPageState();
  const { pathname, search } = useLocation();
  const {
    getModelId: getModelId1,
    setModelId: setModelId1,
    loading: loading1,
    messages: messages1,
    postChat: postChat1,
    continueGeneration: continueGeneration1,
    clear: clearChat1,
    updateSystemContextByModel: updateSystemContextByModel1,
    getStopReason: getStopReason1,
  } = useChat(pathname);


  //const {
    //getModelId: getModelId2,
    //setModelId: setModelId2,
    //loading: loading2,
    //messages: messages2,
    //postChat: postChat2,
    //continueGeneration: continueGeneration2,
    //clear: clearChat2,
    //updateSystemContextByModel: updateSystemContextByModel2,
    //getStopReason: getStopReason2,
  //} = useChat(pathname);

//プルダウン変数宣言

  const [mailtype, setMailtype] = useState<string>(mailtypelist[0].value);
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setMailtype(event.target.value);
  };

  const [service, setService] = useState<string>(servicelist[0].value);
  const selectservice = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setService(event.target.value);
  };

  const [writingstyle, setWritingstyle] = useState<string>(languagelist[0].value);
  const selectwritingstyle = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setWritingstyle(event.target.value);
  };

  const [wordcount, setWordcount] = useState<string>(wordcountlist[0].value);
  const selectwordcount = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setWordcount(event.target.value);
  };

  const [subjectcount, setSubjectcount] = useState<string>(subjectcountlist[0].value);
  const selectsubjectcount = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setSubjectcount(event.target.value);
  };

  const [selected, setSelected] = useState<string>(radiobuttons[0].value);
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => setSelected(event.target.value);
  
  const { setTypingTextInput, typingTextOutput } = useTyping(loading1);
  const { modelIds: availableModels } = MODELS;
  const modelId = getModelId1();
  const prompter = useMemo(() => {
    return getPrompter(modelId);
  }, [modelId]);
  const stopReason = getStopReason1();

  useEffect(() => {
    updateSystemContextByModel1();
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [prompter]);

  const disabledExec = useMemo(() => {
    return mailtype === '' || loading1;
  }, [mailtype, loading1]);

  useEffect(() => {
    const _modelId = !modelId ? availableModels[0] : modelId;
    if (search !== '') {
      const params = queryString.parse(search) as GenerateMailPageLocationState;
      setInformation(params.Param ?? '');
      setContext(params.Param2 ?? '');
      setMailtype(params.mailtype ?? '');
      setService(params.service ?? '');
      setRequirement(params.requirement ?? '');
      setTransmission(params.transmission ?? '');
      setWritingstyle(params.writingstyle ?? '');
      setWordcount(params.wordcount ?? '');
      setSubjectcount(params.subjectcount ?? '');

      setModelId1(
        availableModels.includes(params.modelId ?? '')
          ? params.modelId!
          : _modelId
      );
    } else {
      setModelId1(_modelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setInformation, setContext, setMailtype, setService, setRequirement,setTransmission,setWritingstyle,setWordcount,setSubjectcount, modelId, availableModels, search]);

  useEffect(() => {
    setTypingTextInput(text);
  }, [text, setTypingTextInput]);

  const getGeneratedMail = (information: string, context: string,  mailtype: string, service: string ,requirement: string, transmission: string, writingstyle: string, wordcount: string, subjectcount: string,  ) => {
    postChat1(
      prompter.generateMailPrompt({
        mailtype,
        service,
        requirement,
        transmission,
        writingstyle,
        wordcount,
        information,
        context, 
        subjectcount,
        selected
      }),
      true
    );
      //postChat2(
      //  prompter.generateMailPrompt({
       //   mailtype,
        //  service,
        //  requirement,
        //  transmission,
        //  writingstyle,
        // wordcount,
         // information,
        //  context, 
        //  subjectcount,
        //  selected
      //  }),
      //true
    //);
  };

  // リアルタイムにレスポンスを表示
  useEffect(() => {
    if (messages1.length === 0) return;
    const _lastMessage = messages1[messages1.length - 1];
    if (_lastMessage.role !== 'assistant') return;
    const _response = messages1[messages1.length - 1].content;
    setText(_response.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages1]);

  // 要約を実行
  const onClickExec = useCallback(() => {
    if (loading1) return;
    getGeneratedMail(information, context, mailtype, service, requirement, transmission, writingstyle, wordcount,subjectcount, );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [information, context, mailtype, service, requirement, transmission, writingstyle, wordcount,subjectcount, loading1]);

  // リセット
  const onClickClear = useCallback(() => {
    clear();
    clearChat1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pulldownStyle = {
    borderRadius: "20px",
    borderWidth: "1px",
    borderColor: "lightblue",
    overflow: "hidden",
    margin: "5px",
    padding: "10px 30px 10px 10px"
  };
  const dropdownContainerStyle: React.CSSProperties = {
    position: "relative",
  };
  

  return (
    <div className="grid grid-cols-12">
      <div className="invisible col-span-12 my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min print:visible print:my-5 print:h-min">
        営業メール生成
      </div>
      <div className="col-span-12 col-start-1 mx-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
        <Card label="文章の元になる情報">
          <div className="mb-2 flex w-full">
            <Select
              value={modelId}
              onChange={setModelId1}
              options={availableModels.map((m) => {
              return { value: m, label: m };
              })}
            />
          </div>
          
          <Card label="全体の要件">
            <div style={dropdownContainerStyle}>
              <div className="mb-2 flex">
                <div className="mr-4">
                  <h3>メールタイプ</h3>
                    <div className="w-full">
                      <select
                        style={pulldownStyle}
                        aria-label="メールタイプ"
                        id="selectid"
                        value={mailtype}
                        onChange={handleChange}
                      >
                        {mailtypelist.map((mailtype) => (
                        <option key={mailtype.value} value={mailtype.value}>
                         {mailtype.label}
                        </option>
                       ))}
                     </select>
                    </div>
                  </div>
                <div>
                  <h3>サービス選択</h3>
                    <div className="w-full">
                      <select
                       style={pulldownStyle}
                       id="selectid2"
                       value={service}
                      onChange={selectservice}
                      >
                      {servicelist.map((service) => (
                       <option key={service.value} value={service.value}>
                          {service.label}
                       </option>
                       ))}
                    </select>
                  </div>
                </div>
                </div>
              </div>  
            <h3>伝えたいこと</h3>
            <Textarea
              placeholder="伝えたいこと"
              value={transmission}
              onChange={setTransmission}
              maxHeight={-1}
            />

            <div style={dropdownContainerStyle}>
              <div className="d-flex flex">
                <div className="mr-4">
                      <h3>言語</h3>
                      <select
                        style={pulldownStyle}
                        value={writingstyle}
                        onChange={selectwritingstyle}
                      >
                        {languagelist.map((language) => (
                          <option key={language.value} value={language.value}>
                            {language.label}
                          </option>
                        ))}
                      </select>
                    </div>
                <div>
                <h3>文体</h3>
                <div className="d-flex">
                  {radiobuttons.map((radio) => (
                    <div className="form-check me-3 mb-2" key={radio.value}>
                      <label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="sweets"
                          value={radio.value}
                          checked={radio.value === selected}
                          onChange={changeValue}
                        />
                      </label>
                      <label className="form-check-label">
                        <span className="fs-6">{radio.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
            
          </Card>
          <Card label="本文の設定">
              要件
            <Textarea
              placeholder="メールの要件を入力してください（例）打合せ日程の確認、商品発注のお願いなど"
              value={requirement}
              onChange={setRequirement}
              maxHeight={-1}
            />
              <div style={dropdownContainerStyle}>
              <div className="mb-2 flex">
                <div className="mr-4">
                  <h3>単語数制限</h3>
                    <div className="w-full">
                      <select 
                      style={pulldownStyle}
                      value={wordcount}
                      onChange={selectwordcount} >
                      {wordcountlist.map((wordcount) => (
                      <option key={wordcount.value} value={wordcount.value}>
                      {wordcount.label}
                      </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
          </Card>
          <Card label="件名の設定">  



          件名の要件
            <Textarea
              placeholder="メールの件名の要件を入力してください（例）打合せ日程の確認、商品発注のお願いなど"
              value={context}
              onChange={setContext}
              maxHeight={-1}
            />
              
              <div style={dropdownContainerStyle}>
              <div className="mb-2 flex">
                <div className="mr-4">
                  <h3>件名候補数</h3>
                    <div className="w-full">
                      <select 
                      style={pulldownStyle}
                      value={subjectcount}
                      onChange={selectsubjectcount} >
                      {subjectcountlist.map((subjectcount) => (
                      <option key={subjectcount.value} value={subjectcount.value}>
                      {subjectcount.label}
                      </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container form-check">
        </div>
          </Card>
          
          <div className="flex justify-end gap-3">
            {stopReason === 'max_tokens' && (
              <Button onClick={continueGeneration1}>続きを出力</Button>
            )}

            <Button outlined onClick={onClickClear} disabled={disabledExec}>
              クリア
            </Button>

            <Button disabled={disabledExec} onClick={onClickExec}>
              実行
            </Button>
          </div>

          <div className="mt-5 rounded border border-black/30 p-1.5">
            <Markdown>{typingTextOutput}</Markdown>
            {!loading1 && text === '' && (
              <div className="text-gray-500">
                生成された文章がここに表示されます
              </div>
            )}
            {loading1 && (
              <div className="border-aws-sky size-5 animate-spin rounded-full border-4 border-t-transparent"></div>
            )}
            
            
            <div className="flex w-full justify-end">
              <ButtonCopy text={text} interUseCasesKey="text"></ButtonCopy>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GenerateMailPage;
