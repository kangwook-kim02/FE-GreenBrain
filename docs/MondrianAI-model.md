현재 이슈 46번에는 모델 목록이 3개만 존재하는데 실제 모델 목록은 다음과 같습니다.

1. OpenAI 지원 모델
모델 ID

프로바이더

특징 (Feature)

openai/gpt-5.5

OpenAI

최첨단 지능. 코딩 및 전문적인 업무 수행을 위한 새로운 차원의 지능을 제공합니다.

openai/gpt-5.5-pro

OpenAI

최고 정밀도. GPT-5.5를 기반으로 더욱 스마트하고 정교한 응답을 생성하는 고성능 버전입니다.

openai/gpt-5.4

OpenAI

고성능 효율. 코딩 및 전문 업무를 위해 보다 합리적인 비용으로 제공되는 모델입니다.

openai/gpt-5.4-pro

OpenAI

지능형 분석. GPT-5.4 모델 중 더욱 정밀한 답변과 분석이 가능한 고급 버전입니다.

openai/gpt-5.4-mini

OpenAI

강력한 소형 모델. 코딩, 컴퓨터 사용(Computer Use), 서브 에이전트 구성에 최적화된 역대 가장 강력한 미니 모델입니다.

openai/gpt-5.4-nano

OpenAI

초저비용. 단순 반복적인 대량 작업을 처리하기 위한 가장 경제적인 GPT-5.4급 모델입니다.

openai/gpt-5-mini

OpenAI

저지연 지능. 비용에 민감하고 빠른 응답이 필요한 대규모 워크로드에 적합한 최첨단급 지능형 모델입니다.

openai/gpt-5-nano

OpenAI

초고속 성능. GPT-5 계열 중 가장 빠르고 비용 효율적인 운영이 가능한 버전입니다.

openai/gpt-5

OpenAI

추론 특화. 코딩 및 에이전트 작업에 최적화되어 있으며 추론 강도(Reasoning Effort) 설정이 가능한 모델입니다.

openai/gpt-4.1

OpenAI

범용 지능. 추론 전용 모델을 제외한 일반 모델 중 가장 스마트한 성능을 발휘합니다.

2. Anthropic (Claude) 지원 모델
모델 ID

프로바이더

특징 (Feature)

anthropic/claude-opus-4-7

Anthropic

최고 성능. 초고난이도 추론(X-High Reasoning)과 정교한 분석 능력 제공

anthropic/claude-opus-4-6

Anthropic

대규모 문서 분석 및 복잡한 맥락 이해가 필요한 프로젝트에 최적화

anthropic/claude-sonnet-4-6

Anthropic

주력 모델. 지능과 속도의 완벽한 균형으로 기업용 챗봇 및 자동화에 적합

anthropic/claude-sonnet-4-5

Anthropic

향상된 시각 분석 기능과 정교한 코딩 지시 이행 능력 보유

anthropic/claude-3.7-sonnet

Anthropic

안정적인 추론 성능과 자연스러운 한국어 문장 생성 능력을 갖춘 모델

anthropic/claude-haiku-4-5

Anthropic

초고속 응답. 실시간 고객 응대 및 대량의 단순 데이터 처리에 특화

anthropic/claude-3.5-haiku

Anthropic

Haiku 모델 중 가장 높은 지능을 갖춘 고효율 가성비 모델

3. Google (Gemini) 지원 모델
모델 ID

프로바이더

특징 (Feature)

google/gemini-3.1-pro

Google

최신 모델. 구글의 가장 진보된 AI로 복잡한 지시 이행 및 논리적 추론 강화

google/gemini-3-flash-preview

Google

대규모 데이터 세트 기반의 전문 지식 답변 및 멀티모달 처리 최적화

google/gemini-2.5-pro

Google

비디오, 오디오 분석을 포함한 가장 강력한 멀티모달 분석 지능 제공

google/gemini-2.5-flash

Google

높은 지능을 유지하면서 지연 시간을 획기적으로 줄인 고속 플래시 모델

google/gemini-2.5-flash-lite

Google

극도로 낮은 지연 시간과 비용 효율성을 극대화한 경량 멀티모달 모델

google/gemma-3-27b

Google

특정 도메인 커스텀 및 연구용으로 적합한 고성능 오픈 가중치 모델

### 작업
위 ai 모델에 맞춰서 리스트를 생성해주시고, 실제로 사용자 UI에서는 "gemma-3-27b" 이런식으로만 떠야합니다.
대신 백엔드에 request를 보낼 때는, "google/gemma-3-27b" 이렇게 보내야합니다. 이걸 state에 저장할지, 아니면 key:value로 저장을 해서 key 값은 출력, value 값은 전송데이터로 처리할지는 효율적인 방식을 고민해보고, 작업해주세요. 이후 PR 커멘트에 남겨주시기 바랍니다. 
작업이 마무리 되면, ISSUE 47번도 모델에 대해 데이터를 어떻게 보낼지도 수정해주세요