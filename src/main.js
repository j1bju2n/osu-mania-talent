import './style.css'
import html2canvas from 'html2canvas'

const app = document.querySelector('#app')

const state = {
  age: '',
  gender: '',
  school: '',
  schoolSubtype: '',
  job: '',
  military: '',
  keys: '',

  play4k: {
    years: '',
    shortRank: '',
    longRank: '',
  },

  play7k: {
    years: '',
    shortRank: '',
    longRank: '',
  },

  selectedPerks: [],
  selectedFlaws: [],
  activeTraitCategory: 'perk',
  transitionTarget: '',
  name: '',
}

const fourKeyShortRanks = [
  ['1', '1st'],
  ['2', '2nd'],
  ['3', '3rd'],
  ['4', '4th'],
  ['5', '5th'],
  ['6', '6th'],
  ['7', '7th'],
  ['8', '8th'],
  ['9', '9th'],
  ['10', '10th'],
  ['11', 'Alpha'],
  ['12', 'Beta'],
  ['13', 'Luminal'],
  ['14', 'Gamma'],
  ['15', 'Tachyon'],
  ['16', 'Delta'],
  ['17', 'Epsilon'],
  ['18', 'Zeta'],
  ['19', 'Eta'],
  ['20', 'Theta'],
  ['21', 'Iota'],
  ['22', 'Kappa'],
]

const fourKeyLongRanks = Array.from({ length: 19 }, (_, index) => {
  const value = index + 1
  return [String(value), createOrdinal(value)]
})

const sevenKeyRanks = [
  ['0', '0th'],
  ['1', '1st'],
  ['2', '2nd'],
  ['3', '3rd'],
  ['4', '4th'],
  ['5', '5th'],
  ['6', '6th'],
  ['7', '7th'],
  ['8', '8th'],
  ['9', '9th'],
  ['10', '10th'],
  ['11', 'Gamma'],
  ['12', 'Azimuth'],
  ['13', 'Zenith'],
  ['14', 'Stellium'],
  ['15', 'Stellium+'],
]

const perks = [
  {
    id: 'homosexual',
    name: '동성애자',
    multiplier: 1.45,
    description: '당신은 동성에게 뜨거운 감정을 느끼며 유전자보존에 보편적이지 않습니다.',
    conflicts: ['bisexual', 'heterosexual'],
  },
  {
    id: 'bisexual',
    name: '양성애자',
    multiplier: 1.15,
    description: '당신은 꽤나 욕심쟁이입니다. 또는 모두에게 평등한 사람일수도요.',
    conflicts: ['homosexual', 'heterosexual'],
  },
  {
    id: 'loner',
    name: '찐따',
    multiplier: 1.25,
    description: '당신은 현실 인간과의 관계에서 아무런 흥미를 느끼지 못하거나, 그들이 당신에게 느끼지 못합니다.',
    conflicts: ['popular', 'influencer', 'streamer'],
  },
  {
    id: 'femboy',
    name: '펨보이 / 톰보이',
    multiplier4k: 1.2,
    multiplier7k: 1.15,
    description: '당신은 겉모습의 성 정체성을 바꾼 중첩상태에 있는 양자인간에게 성적 흥미를 가집니다.',
    conflicts: ['homosexual', 'bisexual', 'fetish'],
  },
  {
    id: 'transition',
    name: '성전환',
    description: '당신은 마치 목숨이 두 개 인것 마냥 행동합니다. 제 2의 인생은 어떤가요?',
    statEffects: { long: 4 },
  },
  {
    id: 'ugly',
    name: '못생김',
    multiplier: 1.1,
    description: '당신은 태아 조직 생성 과정에서 각 얼굴 장기의 배치 과정에 약간의 트러블이 생긴 것 같군요.',
    conflicts: ['handsome'],
  },
  {
    id: 'underweight',
    name: '저체중',
    multiplier: 1.15,
    description: '말린 멸치 좋아하세요?',
    statEffects: { short: 3 },
    conflicts: ['overweight'],
  },
  {
    id: 'overweight',
    name: '과체중',
    multiplier: 1.15,
    description: '오늘 저녁은 삼겹살 어때요? 이미 어제 드신 것 같기도 하네요.',
    statEffects: { long: 3 },
    conflicts: ['underweight'],
  },
  {
    id: 'poor',
    name: '빈곤함',
    multiplier: 1.05,
    description: '빈곤은 당신의 잘못이 아닙니다. 아, 당신이 성인이라면 당신의 잘못일 수도 있겠네요.',
    conflicts: ['wealthy'],
  },
  {
    id: 'smoker',
    name: '흡연자',
    multiplier: 1.02,
    description: '당신의 한숨은 그동안의 아픔과 인생의 고난을 모두 털어내는 능력을 가졌습니다.',
    conflicts: ['nonsmoker'],
  },
  {
    id: 'singleParent',
    name: '한부모가정',
    multiplier: 1.17,
    description: '모종의 사유로 상황이 별로 좋지 않네요.',
    conflicts: ['orphan'],
  },
  {
    id: 'orphan',
    name: '고아',
    multiplier: 2,
    description: '당신의 잘못은 아니겠지만, 아무튼 당신은 이제 혼자 남았습니다.',
    conflicts: ['singleParent'],
  },
  {
    id: 'gym',
    name: '헬스인',
    multiplier: 1.01,
    description: '당신은 전완근을 노트를 누르지 않을때도 사용하는것을 즐깁니다.',
    statEffects: { short: -2, long: 2 },
  },
  {
    id: 'otaku',
    name: '씹덕',
    multiplier: 1.01,
    description: '당신은 좀 더 현실과 동떨어진 요소들에게서 더 큰 흥미를 느낍니다.',
  },
  {
    id: 'dirty',
    name: '위생-',
    multiplier: 1.03,
    description: '당신은 현대의학과 과학을 과하게 신뢰하는 것 같네요. 씻지도 않고 청소도 하지 않습니다.',
    conflicts: ['clean'],
  },
  {
    id: 'collector',
    name: '수집가',
    multiplier: 1.02,
    description: '당신은 타인의 신상이나 사진, 동영상과 채팅 내역, 음성녹음 등을 수집하는 괴취미를 가지고있습니다.',
    statEffects: { processing: -2 },
  },
  {
    id: 'twitter',
    name: '트짹이',
    multiplier: 1.03,
    description: '당신은 일론머스크가 이 세상에 태어나지 않았다면 살아갈 수 없었을지도 모르겠네요. 트위터(x)를 자주 접속하고, 게시글을 올리거나, 그랬던 적이 있습니다.',
  },
  {
    id: 'roblox',
    name: 'Roblox',
    multiplier: 1.25,
    description: "당신은 osu!mania에 천부적인 재능을 가지고 태어났습니다. '로블록스를 플레이함.'",
  },
  {
    id: 'lol',
    name: '롤대남',
    multiplier: 1.02,
    description: '롤하고 오스하면 하루가 전부 지나가겠네요.',
  },
  {
    id: 'vrchat',
    name: 'VRChat',
    multiplier: 1.18,
    description: '당신은 신인류입니다. 현실의 껍데기를 벗어던지고 새로운 인류로써 나아가려합니다.',
    statEffects: { short: 2 },
  },
  {
    id: 'mental',
    name: '정신질환',
    multiplier: 1.1,
    description: '어떤 문제든 정신적으로 불안정합니다. 그래서 결국 집에 있는 시간이 길어지겠네요.',
    statEffects: { accuracy: 4 },
  },
  {
    id: 'furry',
    name: '퍼리',
    multiplier: 1.2,
    description: '당신은 사랑을 인간에게만 종속시키지않고, 지구상의 대부분의 유기물을 사랑하기로 결심했습니다.',
    conflicts: ['fetish'],
  },
  {
    id: 'fetish',
    name: '이상성욕',
    multiplier4k: 1.8,
    multiplier7k: 1.4,
    description: '"나는 끈적하고 잘 빠진 보잉747기체를 보고 흥분감을 느껴."',
    conflicts: ['homosexual', 'bisexual', 'furry'],
  },
  {
    id: 'korean',
    name: '한남 / 한녀',
    multiplier: 1.05,
    description: '당신은 남들보다 조금 더 이 작은땅에서 내려져온 유전자가 강하게 몸속에 자리 잡았습니다.',
  },
  {
    id: 'vtuber',
    name: '버튜버사랑꾼',
    multiplier4k: 1.1,
    multiplier7k: 1.3,
    description: '당신은 픽셀쪼가리 뒤에 가려진 의문의 인간 한명에게 애정과 관심을 느낍니다.',
  },
  {
    id: 'maple',
    name: '메이플스토리',
    multiplier: 1.03,
    description: '당신은 대한민국의 전통 RPG에서 시간을 버리는 행위에 즐거움을 느낍니다.',
  },
  {
    id: 'rapidTrigger',
    name: '래피드트리거',
    multiplier4k: 1.06,
    multiplier7k: 1.12,
    description: '당신은 키보드공학의 신기술을 굉장히 빠르고 호전적으로 접근하고 있습니다.',
    statEffects: { long: 1 },
    conflicts: ['oldKeyboard'],
  },
  {
    id: 'introvert',
    name: '내향적',
    multiplier: 1.15,
    description: '당신은 이 테스트를 하는 시점을 기준으로 최근 한달간 외출한 횟수가 10회 미만입니다. 단, 직장, 학업, 업무 등은 제외합니다.',
    conflicts: ['extrovert'],
  },
  {
    id: 'neverDated',
    name: '모쏠',
    multiplier: 2,
    description: '당신은 사랑이 뭔지 아직도 알아내지 못했습니다. 궁금하긴 한가요?',
    conflicts: ['dating', 'notDating', 'married'],
  },
  {
    id: 'irregularSleep',
    name: '비규칙적수면',
    multiplier: 1.18,
    description: '당신은 동물적인 감각에 충실하기로 했습니다. 졸릴때자고, 일어나고싶을때 일어납니다.',
    conflicts: ['regularSleep'],
  },

  {
    id: 'longGame',
    name: '장기전',
    multiplier: 1.2,
    description: '당신은 꾸준합니다, 플레이 경력동안 몇달이상 쉰 적이 없고 꾸준히 게임을 플레이합니다.',
    key4Effects: { processing: 3, accuracy: 3, short: 3, long: 3 },
    key7Effects: { processing: 5, accuracy: 5, short: 5, long: 5 },
    conflicts: ['shortGame'],
  },
  {
    id: 'cheeseLong',
    name: '사기롱',
    multiplier: 1.15,
    description: '시대는 변했고, 이제 당신은 변해버린 시대에 맞춰 머리끝을 단정하게 다듬기 시작합니다.',
    key4Effects: { long: 3 },
    key7Effects: { long: 5 },
    conflicts: ['noCheeseLong'],
  },

  {
    id: 'oppositeSexChaser',
    name: '남미새 / 여미새',
    multiplier: 1.1,
    description: '당신은 이성에 더 많은 애정과 갈증을 느끼고 그들을 쫓습니다. 근데 만남이 이루어질지는 아무도 모르죠.',
    conflicts: ['misogyny'],
  },
  {
    id: 'uncultured',
    name: '비문화인',
    multiplier: 1.7,
    description: '당신은 아직 세상을 살아가는 법을 잘 알지 못합니다, 지하철 환승역을 햇갈리고, 혼자 타지역까지 찾아가 본적이 없고, 키오스크를 잘 사용하지 못한다거나, 카카오맵을 제대로 사용할 줄 모릅니다.',
  },

]

const flaws = [
  {
    id: 'none',
    name: '해당없음',
    special: true,
    description: '당신은 이 온갖 정상적인 카테고리에서 5개를 고르는 것 조차 힘들정도로 너무나도 평범하거나, 너무나도 비 정상적인 삶을 살아가고 있어서 이곳에 선택할 것 조차 없습니다.',
  },
  {
    id: 'goodChild',
    name: '효자',
    multiplier: 2.5,
    description: '당신은 부모님에게 감사함을 알고, 사이가 좋고 그들을 끊임없이 사랑하고 아껴주는 좋은 사람입니다.',
  },
  {
    id: 'dating',
    name: '연애중',
    multiplier: 3,
    description: '당신은 사랑하는 애인과 좋은 시간들을 보내고 있습니다. 앞으로도 그럴겁니다.',
    conflicts: ['neverDated', 'notDating', 'married'],
  },
  {
    id: 'notDating',
    name: '비연애중',
    multiplier: 2,
    description: '당신은 모쏠은 아니지만 연애의 경험이있고, 사랑의 따듯함과 풋풋함을 알고있는 사람입니다.',
    conflicts: ['neverDated', 'dating', 'married'],
  },
  {
    id: 'regularSleep',
    name: '규칙적수면',
    multiplier: 2,
    description: '당신은 본인의 의지건 아니건 제때 자고 제때 일어납니다.',
    conflicts: ['irregularSleep'],
  },
  {
    id: 'extrovert',
    name: '외향적',
    multiplier: 2.4,
    description: '당신은 이 테스트를 진행하는 시간을 기점으로 최근 한달간 10번 이상의 외출을 한 적이 있습니다. 단, 직장 및 등교, 업무는 제외합니다.',
    conflicts: ['introvert'],
  },
  {
    id: 'heterosexual',
    name: '이성애자',
    multiplier: 2,
    description: '당신은 모든 생명체의 유전자중 가장 보편적인 후손 보존 유전자를 가지고 태어났습니다.',
    statEffects: { processing: -2 },
    conflicts: ['homosexual', 'bisexual'],
  },
  {
    id: 'positive',
    name: '긍정적',
    multiplier: 1.5,
    description: '당신은 본인이 노력하면 무엇이든 할 수 있을것이라고 믿습니다. 자신을 사랑하고, 보다 객관적으로 본인을 평가할려고 노력하며, 항상 발전 할 자세를 갖춘 채로 살아갑니다.',
  },
  {
    id: 'popular',
    name: '인싸',
    multiplier: 2.2,
    description: '당신은 몇가지 보잘것없는 이유로 인해 남들에게 많은 사랑과 관심을 받게되었습니다.',
    conflicts: ['loner'],
  },
  {
    id: 'influencer',
    name: '인플루언서',
    multiplier: 1.8,
    description: '당신은 여러 커뮤니티에서 1000명 이상의 팔로워를 보유한 나름 유명인입니다.',
    conflicts: ['loner'],
  },
  {
    id: 'streamer',
    name: '방송인',
    multiplier: 1.6,
    description: '당신은 게임 실력을 올리는 것 보단 남들에게 관심을 받는게 더 중요한 모양이네요. 특정 플랫폼에서 100명 / 유튜브 구독자 500명 이상의 팔로워를 보유한채로 방송중입니다.',
    statEffects: { processing: -4 },
    conflicts: ['loner'],
  },
  {
    id: 'handsome',
    name: '잘생김',
    multiplier: 3,
    description: '당신은 유전자 배치 과정에서 굉장히 효율적으로 타인에게 호감을 받을 수 있는 구조를 알아냈습니다.',
    conflicts: ['ugly'],
  },
  {
    id: 'nonsmoker',
    name: '비흡연자',
    multiplier: 1.5,
    description: '당신은 이딴 손 안에 들어오는 작은 무기물에게 중독되지 않습니다.',
    conflicts: ['smoker'],
  },
  {
    id: 'clean',
    name: '위생+',
    multiplier: 1.8,
    description: '사람은 깔끔해야합니다. 당연한소리지만',
    conflicts: ['dirty'],
  },
  {
    id: 'oldKeyboard',
    name: '구형키보드',
    multiplier: 1.5,
    description: '당신은 출시된지 5년이상이 지난 키보드를 사용중입니다. 시대에 따라갈 필요가 있겠네요.',
    statEffects: { processing: -4 },
    conflicts: ['rapidTrigger'],
  },
  {
    id: 'donor',
    name: '기부천사',
    multiplier: 1.5,
    description: '당신은 타인에게 아무런 대가를 요구하지 않고 여러 물품이나 금전적 혜택을 지급하는것에 행복을 느끼는 천사입니다.',
    statEffects: { processing: -1 },
  },
  {
    id: 'drinker',
    name: '애주가',
    multiplier: 1.3,
    description: '당신은 삶의 행복을 작은 술 한잔에서 굉장히 높게 채울 수 있는 능력을 가지고있습니다. 하지만 술에 취하면 리듬게임 하긴 힘들겠네요.',
  },
  {
    id: 'reader',
    name: '독서가',
    multiplier: 3,
    description: '당신은 다른 인간군상의 삶의 단편, 화려한 상상, 잊혀진 역사를 문헌을 통해 즐기는 삶을 즐깁니다.',
  },
  {
    id: 'professional',
    name: '전문직',
    multiplier: 5,
    description: '당신은 수많은 노력과 젊은날의 희생을 통해, 안정적이고 편안한 미래와 금전적 여유를 얻었습니다.',
    statEffects: { processing: -10, accuracy: -10 },
    requiresEmployed: true,
  },
  {
    id: 'married',
    name: '기혼자',
    multiplier: 7,
    description: '당신은 사랑하는 연인과 평생을 함께할 서약을 맺고, 영원히 함께 할 것만 같은 동반자를 얻었습니다.',
    statEffects: { processing: -10 },
    conflicts: ['neverDated', 'dating', 'notDating'],
  },
  {
    id: 'wealthy',
    name: '부유함',
    multiplier: 1.05,
    description: '당신은 본인의 성과던, 부모의 덕이던 굉장히 살만한 인생을 살아가고있습니다.',
    statEffects: { processing: 4 },
    conflicts: ['poor'],
  },
  {
    id: 'graduate',
    name: '대학원생',
    multiplier: 5,
    description: '당신은 진로의 미래를 결정하기 위해 확실한 선택을 했고, 그 결과를 얻어냈습니다.',
    requiresUniversity: true,
  },

  {
    id: 'shortGame',
    name: '단기전',
    multiplier: 1.5,
    description: '당신은 이 게임에 별로 진심이 아닌거같네요. 플레이세션이 불규칙적이고 오랫동안 쉬거나 다른게임을 하러 가곤 합니다.',
    key4Effects: { processing: 1, accuracy: 1, short: 1, long: 1 },
    key7Effects: { processing: 2, accuracy: 2, short: 2, long: 2 },
    conflicts: ['longGame'],
  },
  {
    id: 'noCheeseLong',
    name: '노사기롱',
    multiplier: 1.3,
    description: '당신은 롱노트 홀드 끝자락이 스냅에 정확히 일치하는것이 세상의 이치라 생각하고, 그것만이 채보를 완벽하게 이해하는 지름길이라고 믿습니다.',
    key4Effects: { long: -5 },
    key7Effects: { long: 6 },
    conflicts: ['cheeseLong'],
  },

  {
    id: 'misogyny',
    name: '남혐 / 여혐',
    multiplier: 1.4,
    description: '당신은 2개밖에 없는 인간의 유일한 과학적 성별을 거부합니다.',
    conflicts: ['oppositeSexChaser'],
  },
  {
    id: 'healthy',
    name: '건강함',
    multiplier: 3,
    description: '당신은 신체 및 정신에 아무런 문제가없으며, 아주 건강하고 건실하게 살아가고 있습니다.',
    conflicts: ['mental'],
  },
  {
    id: 'affectionDeficit',
    name: '애정결핍',
    multiplier: 2,
    description: '당신은 성적인 욕망을 제외하고 순수하게 인간에게서 받는 관심과 애정에 미쳐있습니다.',
  },

]

function setupRestartControl() {
  const existing = document.querySelector('#globalRestartButton')
  if (existing) existing.remove()

  const button = document.createElement('button')
  button.id = 'globalRestartButton'
  button.className = 'global-restart-button'
  button.type = 'button'
  button.textContent = '처음부터 다시하기'
  button.addEventListener('click', showRestartConfirmation)

  document.body.appendChild(button)
}

function showRestartConfirmation() {
  const existing = document.querySelector('#restartModal')
  if (existing) return

  const modal = document.createElement('div')
  modal.id = 'restartModal'
  modal.className = 'restart-modal'
  modal.innerHTML = `
    <div class="restart-dialog">
      <h3>정말 처음부터 시작하시겠어요?</h3>
      <p>지금까지 입력한 정보와 선택한 특성이 모두 초기화됩니다.</p>

      <div class="restart-dialog-actions">
        <button id="restartNoButton" class="secondary-button" type="button">
          아니요
        </button>

        <button id="restartYesButton" class="danger-button" type="button">
          예
        </button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  document.querySelector('#restartNoButton').addEventListener('click', () => {
    modal.remove()
  })

  document.querySelector('#restartYesButton').addEventListener('click', () => {
    resetState()
    modal.remove()

    const restartButton = document.querySelector('#globalRestartButton')
    if (restartButton) restartButton.remove()

    renderHome()
  })
}

function resetState() {
  state.age = ''
  state.gender = ''
  state.school = ''
  state.schoolSubtype = ''
  state.job = ''
  state.military = ''
  state.keys = ''
  state.play4k = { years: '', shortRank: '', longRank: '' }
  state.play7k = { years: '', shortRank: '', longRank: '' }
  state.selectedPerks = []
  state.selectedFlaws = []
  state.activeTraitCategory = 'perk'
  state.transitionTarget = ''
  state.name = ''
}

function renderHome() {
  const restartButton = document.querySelector('#globalRestartButton')
  if (restartButton) restartButton.remove()
  app.innerHTML = `
    <main class="page page-center">
      <section class="hero">
        <p class="eyebrow">RHYTHM GAME TALENT TEST</p>

        <h1>Osu!mania<br />재능상수 측정기</h1>

        <p class="description">
          기본 정보와 플레이 성향을 바탕으로<br />
          당신의 리듬게임 재능상수를 계산합니다.
        </p>

        <button id="startButton" class="primary-button" type="button">
          시작하기
        </button>

        <p class="notice">
          입력한 정보는 저장되거나 수집되지 않습니다.
        </p>
      </section>
    </main>
  `

  document.querySelector('#startButton').addEventListener('click', renderBasicInfo)
}

function renderBasicInfo() {
  app.innerHTML = `
    <main class="page">
      <section class="form-container">
        <div class="page-header">
          <button id="backButton" class="text-button" type="button">
            ← 돌아가기
          </button>

          <p class="step">STEP 1</p>

          <h2>기본 정보를 입력해주세요</h2>

          <p class="header-description">
            입력한 정보는 초기 재능상수 계산과 퍽 선택 조건에 사용됩니다.
          </p>
        </div>

        <div class="form-card">
          <label class="field">
            <span class="field-label">나이</span>

            <input
              id="ageInput"
              type="number"
              min="1"
              max="100"
              step="1"
              placeholder="예: 22"
              value="${state.age}"
            />

            <span class="field-help">
              1세부터 100세까지 입력할 수 있습니다.
            </span>
          </label>

          <fieldset class="field">
            <legend class="field-label">성별</legend>

            <div class="choice-grid choice-grid-3">
              ${createRadioChoice('gender', 'male', '남성', state.gender)}
              ${createRadioChoice('gender', 'female', '여성', state.gender)}
              ${createRadioChoice('gender', 'other', '기타', state.gender)}
            </div>
          </fieldset>

          <label class="field">
            <span class="field-label">학교</span>

            <select id="schoolSelect">
              ${createSchoolOptions(Number(state.age))}
            </select>
          </label>

          <div id="schoolSubtypeArea"></div>
          <div id="adultArea"></div>

          <fieldset class="field">
            <legend class="field-label">플레이하는 키</legend>

            <div class="choice-grid choice-grid-3">
              ${createRadioChoice('keys', '4k', '4키', state.keys)}
              ${createRadioChoice('keys', '7k', '7키', state.keys)}
              ${createRadioChoice('keys', 'both', '둘 다', state.keys)}
            </div>
          </fieldset>

          <p id="errorMessage" class="error-message"></p>

          <button id="nextButton" class="primary-button full-button" type="button">
            다음으로
          </button>
        </div>
      </section>
    </main>
  `

  const ageInput = document.querySelector('#ageInput')
  const schoolSelect = document.querySelector('#schoolSelect')

  ageInput.addEventListener('input', (event) => {
    state.age = event.target.value
    updateSchoolOptions()
    renderConditionalAreas()
  })

  schoolSelect.addEventListener('change', (event) => {
    state.school = event.target.value
    state.schoolSubtype = ''
    renderConditionalAreas()
  })

  document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      state.gender = event.target.value
      renderConditionalAreas()
    })
  })

  document.querySelectorAll('input[name="keys"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      state.keys = event.target.value
    })
  })

  document.querySelector('#backButton').addEventListener('click', renderHome)
  document.querySelector('#nextButton').addEventListener('click', validateBasicInfo)

  renderConditionalAreas()

  setupRestartControl()

}

function renderConditionalAreas() {
  renderSchoolSubtype()
  renderAdultFields()
}

function renderSchoolSubtype() {
  const area = document.querySelector('#schoolSubtypeArea')
  if (!area) return

  if (state.school === 'high' || state.school === 'high-graduate') {
    area.innerHTML = `
      <label class="field">
        <span class="field-label">고등학교 분류</span>

        <select id="schoolSubtypeSelect">
          <option value="">선택해주세요</option>
          ${createOption('general', '일반고', state.schoolSubtype)}
          ${createOption('technical', '공고', state.schoolSubtype)}
          ${createOption('vocational', '특성화고', state.schoolSubtype)}
          ${createOption('gifted', '영재고', state.schoolSubtype)}
        </select>
      </label>
    `
  } else if (state.school === 'university') {
    area.innerHTML = `
      <label class="field">
        <span class="field-label">대학교 분류</span>

        <select id="schoolSubtypeSelect">
          <option value="">선택해주세요</option>
          ${createOption('sky', 'SKY', state.schoolSubtype)}
          ${createOption('seoul', '인서울', state.schoolSubtype)}
          ${createOption('regional', '지방대', state.schoolSubtype)}
          ${createOption('junior', '전문대', state.schoolSubtype)}
        </select>
      </label>
    `
  } else {
    area.innerHTML = ''
    return
  }

  document
    .querySelector('#schoolSubtypeSelect')
    .addEventListener('change', (event) => {
      state.schoolSubtype = event.target.value
    })
}

function renderAdultFields() {
  const area = document.querySelector('#adultArea')
  if (!area) return

  const age = Number(state.age)
  const isAdult = age >= 19
  const showMilitary = isAdult && state.gender === 'male'

  if (!isAdult) {
    state.job = ''
    state.military = ''
    area.innerHTML = ''
    return
  }

  area.innerHTML = `
    <fieldset class="field">
      <legend class="field-label">현재 직업 상태</legend>

      <div class="choice-grid choice-grid-2">
        ${createRadioChoice('job', 'employed', '직장인', state.job)}
        ${createRadioChoice('job', 'unemployed', '무직', state.job)}
      </div>
    </fieldset>

    ${
      showMilitary
        ? `
          <fieldset class="field">
            <legend class="field-label">병역 상태</legend>

            <div class="choice-grid choice-grid-4">
              ${createRadioChoice('military', 'active', '현역', state.military)}
              ${createRadioChoice('military', 'unserved', '미필', state.military)}
              ${createRadioChoice('military', 'public', '공익', state.military)}
              ${createRadioChoice('military', 'exempt', '면제', state.military)}
            </div>
          </fieldset>
        `
        : ''
    }
  `

  document.querySelectorAll('input[name="job"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      state.job = event.target.value
    })
  })

  document.querySelectorAll('input[name="military"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      state.military = event.target.value
    })
  })

  if (!showMilitary) {
    state.military = ''
  }
}

function validateBasicInfo() {
  const errorMessage = document.querySelector('#errorMessage')
  const age = Number(state.age)
  const isAdult = age >= 19

  if (!Number.isInteger(age) || age < 1 || age > 100) {
    errorMessage.textContent =
      '나이를 1세부터 100세 사이의 정수로 입력해주세요.'
    return
  }

  if (!state.gender) {
    errorMessage.textContent = '성별을 선택해주세요.'
    return
  }

  if (!state.school) {
    errorMessage.textContent = '학교를 선택해주세요.'
    return
  }

  if (!isSchoolAllowedForAge(state.school, age)) {
    errorMessage.textContent = '현재 나이에 맞는 학교를 선택해주세요.'
    return
  }

  if (
    (state.school === 'high' || state.school === 'high-graduate' || state.school === 'university') &&
    !state.schoolSubtype
  ) {
    errorMessage.textContent = '학교 세부 분류를 선택해주세요.'
    return
  }

  if (isAdult && !state.job) {
    errorMessage.textContent = '현재 직업 상태를 선택해주세요.'
    return
  }

  if (isAdult && state.gender === 'male' && !state.military) {
    errorMessage.textContent = '병역 상태를 선택해주세요.'
    return
  }

  if (!state.keys) {
    errorMessage.textContent = '플레이하는 키를 선택해주세요.'
    return
  }

  errorMessage.textContent = ''
  renderPlayInfo()
}

function renderPlayInfo() {
  const show4k = state.keys === '4k' || state.keys === 'both'
  const show7k = state.keys === '7k' || state.keys === 'both'

  app.innerHTML = `
    <main class="page">
      <section class="form-container">
        <div class="page-header">
          <button id="backButton" class="text-button" type="button">
            ← 기본 정보로
          </button>

          <p class="step">STEP 2</p>

          <h2>플레이 정보를 입력해주세요</h2>

          <p class="header-description">
            각 키의 플레이 경력과 현재 단위인정을 입력해주세요.
          </p>
        </div>

        <div class="form-card">
          ${
            show4k
              ? createKeyInputSection({
                  keyName: '4키',
                  keyCode: 'key4',
                  years: state.play4k.years,
                  shortRank: state.play4k.shortRank,
                  longRank: state.play4k.longRank,
                  shortRanks: fourKeyShortRanks,
                  longRanks: fourKeyLongRanks,
                })
              : ''
          }

          ${
            show4k && show7k
              ? '<div class="section-divider"></div>'
              : ''
          }

          ${
            show7k
              ? createKeyInputSection({
                  keyName: '7키',
                  keyCode: 'key7',
                  years: state.play7k.years,
                  shortRank: state.play7k.shortRank,
                  longRank: state.play7k.longRank,
                  shortRanks: sevenKeyRanks,
                  longRanks: sevenKeyRanks,
                })
              : ''
          }

          <p id="errorMessage" class="error-message"></p>

          <button id="nextButton" class="primary-button full-button" type="button">
            다음으로
          </button>
        </div>
      </section>
    </main>
  `

  bindPlayInfoEvents()

  document.querySelector('#backButton').addEventListener('click', renderBasicInfo)
  document.querySelector('#nextButton').addEventListener('click', validatePlayInfo)

  setupRestartControl()

}

function createKeyInputSection({
  keyName,
  keyCode,
  years,
  shortRank,
  longRank,
  shortRanks,
  longRanks,
}) {
  return `
    <section class="key-section">
      <p class="step key-step">${keyName.toUpperCase()} PLAY DATA</p>
      <h3 class="key-title">${keyName} 정보</h3>

      <label class="field">
        <span class="field-label">${keyName} 플레이 경력</span>

        <input
          id="${keyCode}Years"
          type="number"
          min="0"
          max="30"
          step="1"
          placeholder="예: 4"
          value="${years}"
        />

        <span class="field-help">
          1년 미만이라면 0을 입력해주세요.
        </span>
      </label>

      <label class="field">
        <span class="field-label">${keyName} 단놋 현재 단위</span>

        <select id="${keyCode}ShortRank">
          ${createRankOptions(shortRanks, shortRank)}
        </select>
      </label>

      <label class="field">
        <span class="field-label">${keyName} 롱놋 현재 단위</span>

        <select id="${keyCode}LongRank">
          ${createRankOptions(longRanks, longRank)}
        </select>
      </label>
    </section>
  `
}

function createRankOptions(ranks, selectedValue) {
  return `
    <option value="">선택해주세요</option>
    ${createOption('not-playing', '플레이 안 함', selectedValue)}
    ${createOption('unranked', '미취득', selectedValue)}
    ${ranks
      .map(([value, label]) => createOption(value, label, selectedValue))
      .join('')}
  `
}

function bindPlayInfoEvents() {
  const show4k = state.keys === '4k' || state.keys === 'both'
  const show7k = state.keys === '7k' || state.keys === 'both'

  if (show4k) {
    document.querySelector('#key4Years').addEventListener('input', (event) => {
      state.play4k.years = event.target.value
    })

    document.querySelector('#key4ShortRank').addEventListener('change', (event) => {
      state.play4k.shortRank = event.target.value
    })

    document.querySelector('#key4LongRank').addEventListener('change', (event) => {
      state.play4k.longRank = event.target.value
    })
  }

  if (show7k) {
    document.querySelector('#key7Years').addEventListener('input', (event) => {
      state.play7k.years = event.target.value
    })

    document.querySelector('#key7ShortRank').addEventListener('change', (event) => {
      state.play7k.shortRank = event.target.value
    })

    document.querySelector('#key7LongRank').addEventListener('change', (event) => {
      state.play7k.longRank = event.target.value
    })
  }
}

function validatePlayInfo() {
  const errorMessage = document.querySelector('#errorMessage')
  const show4k = state.keys === '4k' || state.keys === 'both'
  const show7k = state.keys === '7k' || state.keys === 'both'

  if (show4k) {
    const years = Number(state.play4k.years)

    if (
      state.play4k.years === '' ||
      !Number.isInteger(years) ||
      years < 0 ||
      years > 30
    ) {
      errorMessage.textContent =
        '4키 플레이 경력을 0년부터 30년 사이로 입력해주세요.'
      return
    }

    if (!state.play4k.shortRank) {
      errorMessage.textContent = '4키 단놋 현재 단위를 선택해주세요.'
      return
    }

    if (!state.play4k.longRank) {
      errorMessage.textContent = '4키 롱놋 현재 단위를 선택해주세요.'
      return
    }
  }

  if (show7k) {
    const years = Number(state.play7k.years)

    if (
      state.play7k.years === '' ||
      !Number.isInteger(years) ||
      years < 0 ||
      years > 30
    ) {
      errorMessage.textContent =
        '7키 플레이 경력을 0년부터 30년 사이로 입력해주세요.'
      return
    }

    if (!state.play7k.shortRank) {
      errorMessage.textContent = '7키 단놋 현재 단위를 선택해주세요.'
      return
    }

    if (!state.play7k.longRank) {
      errorMessage.textContent = '7키 롱놋 현재 단위를 선택해주세요.'
      return
    }
  }

  errorMessage.textContent = ''
  renderBasicTalentResult()
}

function renderBasicTalentResult() {
  const result = calculateBasicTalent()

  app.innerHTML = `
    <main class="page page-center">
      <section class="form-container">
        <div class="page-header">
          <button id="backButton" class="text-button" type="button">
            ← 플레이 정보로
          </button>

          <p class="step">STEP 3</p>
          <h2>기본 재능상수가 계산됐습니다</h2>

          <p class="header-description">
            기본 정보만 반영한 초기 수치입니다.
          </p>
        </div>

        <div class="result-card">
          <p class="result-label">기본 재능상수</p>

          <strong class="result-number">
            ${formatNumber(result.basicTalent)}
          </strong>

          <div class="point-preview">
            <span>초기 퍽 포인트</span>
            <strong>${formatNumber(result.initialPoint)}</strong>
          </div>

          <p class="point-rule">
            ${
              result.pointDivisor === 3
                ? '10세 이하 및 30세 이상은 초기 퍽 포인트가 덜 지급됩니다. 재능상수 ÷ 3만큼 지급됩니다.'
                : '재능상수 ÷ 2만큼 지급됩니다.'
            }
          </p>
        </div>

        <button id="nextButton" class="primary-button full-button" type="button">
          후천적 특성 선택으로
        </button>
      </section>
    </main>
  `

  document.querySelector('#backButton').addEventListener('click', renderPlayInfo)
  document.querySelector('#nextButton').addEventListener('click', renderPerksAndFlaws)

  setupRestartControl()
}

function renderPerksAndFlaws() {
  const pointResult = calculatePerkPoint()
  const showingPerks = state.activeTraitCategory === 'perk'
  const activeItems = showingPerks ? perks : flaws
  const activeType = showingPerks ? 'perk' : 'flaw'

  app.innerHTML = `
    <main class="page">
      <section class="wide-container">
        <div class="page-header">
          <button id="backButton" class="text-button" type="button">
            ← 기본 재능상수로
          </button>

          <p class="step">STEP 4</p>
          <h2>후천적 특성 선택하기</h2>

          <p class="header-description">
            리듬재능특성은 선택하지 않아도 되지만, 리듬부정특성은 최소 5개를 선택해야 합니다.
            서로 충돌하는 항목은 동시에 선택할 수 없습니다.
          </p>
        </div>

        <div class="point-bar">
          <div>
            <span class="point-bar-label">현재 포인트</span>
            <strong>${formatNumber(pointResult.finalPoint)}</strong>
          </div>

          <div class="point-bar-sub">
            초기 ${formatNumber(pointResult.initialPoint)}
            · Positive ${formatSignedNumber(pointResult.positiveChange)}
            · Negative ${formatSignedNumber(-pointResult.flawChange)}
          </div>
        </div>

        <div class="trait-tabs" role="tablist" aria-label="특성 카테고리">
          <button
            class="trait-tab ${showingPerks ? 'is-active' : ''}"
            type="button"
            data-category="perk"
          >
            <span>POSITIVE</span>
            <strong>리듬재능특성</strong>
            <small>${state.selectedPerks.length}개 선택</small>
          </button>

          <button
            class="trait-tab ${!showingPerks ? 'is-active' : ''}"
            type="button"
            data-category="flaw"
          >
            <span>NEGATIVE</span>
            <strong>리듬부정특성</strong>
            <small>${getFlawSelectionText()}</small>
          </button>
        </div>

        <section class="trait-section">
          <div class="trait-heading">
            <div>
              <p class="trait-kicker">${showingPerks ? 'POSITIVE' : 'NEGATIVE'}</p>
              <h3>${showingPerks ? '리듬재능특성' : '리듬부정특성'}</h3>
            </div>
            <strong>
              ${showingPerks ? `${state.selectedPerks.length}개 선택` : getFlawSelectionText()}
            </strong>
          </div>

          ${
            showingPerks && state.selectedPerks.includes('transition')
              ? createTransitionTargetSelector()
              : ''
          }

          <div class="trait-grid">
            ${activeItems.map((item) => createTraitCard(item, activeType)).join('')}
          </div>
        </section>

        <p id="errorMessage" class="error-message trait-error"></p>

        <button id="nextButton" class="primary-button full-button" type="button">
          선택 완료
        </button>
      </section>
    </main>
  `

  document.querySelector('#backButton').addEventListener('click', renderBasicTalentResult)

  document.querySelectorAll('[data-category]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeTraitCategory = button.dataset.category
      renderPerksAndFlaws()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  })

  document.querySelectorAll('[data-trait-type]').forEach((button) => {
    button.addEventListener('click', () => {
      toggleTrait(button.dataset.traitType, button.dataset.traitId)
    })
  })

  document.querySelectorAll('[data-transition-target]').forEach((button) => {
    button.addEventListener('click', () => {
      state.transitionTarget = button.dataset.transitionTarget
      renderPerksAndFlaws()
    })
  })

  document.querySelector('#nextButton').addEventListener('click', validateTraits)

  setupRestartControl()

}

function createTransitionTargetSelector() {
  const options =
    state.gender === 'male'
      ? [
          { value: 'female', label: '여성으로 전환', multiplier: 3 },
          { value: 'other', label: '기타로 전환', multiplier: 2 },
        ]
      : state.gender === 'female'
        ? [
            { value: 'male', label: '남성으로 전환', multiplier: 1.1 },
            { value: 'other', label: '기타로 전환', multiplier: 2 },
          ]
        : []

  if (options.length === 0) {
    return `
      <div class="transition-selector">
        <strong>성전환 방향</strong>
        <p>기본 성별이 기타인 경우 현재 규칙상 적용 가능한 전환 방향이 없습니다.</p>
      </div>
    `
  }

  return `
    <div class="transition-selector">
      <strong>성전환 방향을 선택해주세요</strong>

      <div class="transition-options">
        ${options
          .map(
            (option) => `
              <button
                class="${state.transitionTarget === option.value ? 'is-active' : ''}"
                type="button"
                data-transition-target="${option.value}"
              >
                ${option.label} · ×${formatCompactMultiplier(option.multiplier)}
              </button>
            `,
          )
          .join('')}
      </div>
    </div>
  `
}

function createTraitCard(item, type) {
  const selectedList =
    type === 'perk' ? state.selectedPerks : state.selectedFlaws

  const selected = selectedList.includes(item.id)
  const disabledReason = getTraitDisabledReason(item, type)
  const disabled = Boolean(disabledReason)
  const multiplierText = getDisplayedMultiplierText(item, type)

  return `
    <button
      class="trait-card trait-${type} ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}"
      type="button"
      data-trait-type="${type}"
      data-trait-id="${item.id}"
      ${disabled ? 'disabled' : ''}
    >
      <span class="trait-card-top">
        <strong>${item.name}</strong>
        <span>${multiplierText}</span>
      </span>

      <span class="trait-description">
        ${item.description}
      </span>

      ${
        disabledReason
          ? `<span class="trait-disabled-reason">${disabledReason}</span>`
          : ''
      }
    </button>
  `
}

function getDisplayedMultiplierText(item, type) {
  if (item.id === 'none') {
    return state.selectedPerks.length === 0 ? '− ×15' : '− ×3'
  }

  if (item.id === 'transition') {
    const multiplier = getTransitionMultiplier()
    return multiplier ? `×${formatCompactMultiplier(multiplier)}` : '방향 선택 필요'
  }

  const multiplier = getAppliedMultiplier(item)
  const sign = type === 'flaw' ? '− ' : '+ '

  return `${sign}×${formatCompactMultiplier(multiplier)}`
}

function formatCompactMultiplier(value) {
  return Number(value).toFixed(2).replace(/\.?0+$/, '')
}

function getTransitionMultiplier() {
  if (state.gender === 'male') {
    return state.transitionTarget === 'female' ? 3 : state.transitionTarget === 'other' ? 2 : 0
  }

  if (state.gender === 'female') {
    return state.transitionTarget === 'male' ? 1.1 : state.transitionTarget === 'other' ? 2 : 0
  }

  return 0
}

function getAppliedMultiplier(item) {
  if (item.id === 'transition') {
    return getTransitionMultiplier()
  }

  if (item.multiplier4k && item.multiplier7k) {
    if (state.keys === '4k') return item.multiplier4k
    if (state.keys === '7k') return item.multiplier7k
    return Math.max(item.multiplier4k, item.multiplier7k)
  }

  return item.multiplier ?? 0
}

function getTraitDisabledReason(item, type) {
  const allSelected = [...state.selectedPerks, ...state.selectedFlaws]
  const currentlySelected =
    type === 'perk'
      ? state.selectedPerks.includes(item.id)
      : state.selectedFlaws.includes(item.id)

  if (currentlySelected) return ''

  if (type === 'flaw' && item.id !== 'none' && state.selectedFlaws.includes('none')) {
    return '해당없음과 함께 선택할 수 없습니다.'
  }

  if (type === 'flaw' && item.id === 'none' && state.selectedFlaws.length > 0) {
    return '다른 Flaw와 함께 선택할 수 없습니다.'
  }

  if (item.requiresEmployed && state.job !== 'employed') {
    return '직장인일 때만 선택할 수 있습니다.'
  }

  if (
    item.requiresUniversity &&
    state.school !== 'university' &&
    state.school !== 'university-dropout'
  ) {
    return '대학교 또는 대학교 자퇴일 때만 선택할 수 있습니다.'
  }

  const conflict = (item.conflicts || []).find((id) => allSelected.includes(id))

  if (conflict) {
    return '이미 선택한 항목과 충돌합니다.'
  }

  const reverseConflict = [...perks, ...flaws].find(
    (other) =>
      allSelected.includes(other.id) &&
      (other.conflicts || []).includes(item.id),
  )

  if (reverseConflict) {
    return '이미 선택한 항목과 충돌합니다.'
  }

  return ''
}

function toggleTrait(type, id) {
  const targetList = type === 'perk' ? state.selectedPerks : state.selectedFlaws

  if (targetList.includes(id)) {
    const index = targetList.indexOf(id)
    targetList.splice(index, 1)

    if (id === 'transition') {
      state.transitionTarget = ''
    }

    renderPerksAndFlaws()
    return
  }

  if (type === 'flaw' && id === 'none') {
    state.selectedFlaws = ['none']
  } else if (type === 'flaw') {
    state.selectedFlaws = state.selectedFlaws.filter((item) => item !== 'none')
    state.selectedFlaws.push(id)
  } else {
    state.selectedPerks.push(id)
  }

  renderPerksAndFlaws()
}

function calculatePerkPoint() {
  const basicResult = calculateBasicTalent()
  const initialPoint = basicResult.initialPoint
  const unit = Math.abs(initialPoint) / 10

  const positiveChange = state.selectedPerks.reduce((total, id) => {
    const item = perks.find((perk) => perk.id === id)
    return total + unit * getAppliedMultiplier(item)
  }, 0)

  let flawChange = state.selectedFlaws
    .filter((id) => id !== 'none')
    .reduce((total, id) => {
      const item = flaws.find((flaw) => flaw.id === id)
      return total + unit * getAppliedMultiplier(item)
    }, 0)

  let specialPenalty = 0

  if (state.selectedFlaws.includes('none')) {
    specialPenalty =
      state.selectedPerks.length === 0
        ? unit * 15
        : unit * 3
  }

  let positiveSynergy = 0
  let negativeSynergy = 0

  if (
    state.selectedPerks.includes('otaku') &&
    state.selectedPerks.includes('dirty')
  ) {
    positiveSynergy += unit * 1.02
  }

  if (
    state.selectedPerks.includes('collector') &&
    state.selectedPerks.includes('twitter')
  ) {
    positiveSynergy += unit * 1.01
  }

  if (state.selectedPerks.includes('roblox') && Number(state.age) < 20) {
    positiveSynergy += unit * 1.1
  }

  if (
    state.selectedPerks.includes('oppositeSexChaser') &&
    state.selectedPerks.includes('korean')
  ) {
    positiveSynergy += unit * 1.01
  }

  if (
    state.selectedFlaws.includes('healthy') &&
    state.selectedFlaws.includes('positive')
  ) {
    negativeSynergy += unit * 2
  }

  if (
    state.selectedFlaws.includes('affectionDeficit') &&
    state.selectedPerks.includes('mental')
  ) {
    negativeSynergy += unit * 2
  }

  flawChange += specialPenalty + negativeSynergy

  const finalPoint =
    initialPoint +
    positiveChange +
    positiveSynergy -
    flawChange

  return {
    initialPoint,
    positiveChange: positiveChange + positiveSynergy,
    flawChange,
    finalPoint,
  }
}

function getFlawSelectionText() {
  if (state.selectedFlaws.includes('none')) {
    return '해당없음 선택'
  }

  return `${state.selectedFlaws.length} / 5개 이상`
}

function validateTraits() {
  const errorMessage = document.querySelector('#errorMessage')
  const hasNone = state.selectedFlaws.includes('none')

  if (!hasNone && state.selectedFlaws.length < 5) {
    errorMessage.textContent = '리듬부정특성을 최소 5개 선택해주세요.'
    return
  }

  if (
    state.selectedPerks.includes('transition') &&
    getTransitionMultiplier() === 0
  ) {
    state.activeTraitCategory = 'perk'
    errorMessage.textContent = '성전환 방향을 선택해주세요.'
    return
  }

  errorMessage.textContent = ''
  renderNameInput()
}


function renderNameInput() {
  app.innerHTML = `
    <main class="page page-center">
      <section class="name-container">
        <button id="backButton" class="text-button" type="button">
          ← 특성 선택으로
        </button>

        <p class="step">STEP 5</p>
        <h2>결과에 표시할 이름을 입력해주세요</h2>

        <p class="header-description">
          입력한 이름은 결과 화면에만 표시되며 저장되지 않습니다.
        </p>

        <div class="form-card name-card">
          <label class="field">
            <span class="field-label">이름</span>

            <input
              id="nameInput"
              class="text-input"
              type="text"
              maxlength="20"
              placeholder="예: 홍길동"
              value="${escapeHtml(state.name)}"
            />
          </label>

          <p id="errorMessage" class="error-message"></p>

          <button id="resultButton" class="primary-button full-button" type="button">
            최종 결과 보기
          </button>
        </div>
      </section>
    </main>
  `

  document.querySelector('#backButton').addEventListener('click', renderPerksAndFlaws)

  document.querySelector('#nameInput').addEventListener('input', (event) => {
    state.name = event.target.value
  })

  document.querySelector('#resultButton').addEventListener('click', () => {
    const errorMessage = document.querySelector('#errorMessage')
    const trimmedName = state.name.trim()

    if (!trimmedName) {
      errorMessage.textContent = '결과에 표시할 이름을 입력해주세요.'
      return
    }

    state.name = trimmedName
    renderFinalResult()
  })

  setupRestartControl()

}

function renderFinalResult() {
  const globalRestartButton = document.querySelector('#globalRestartButton')
  if (globalRestartButton) globalRestartButton.remove()

  const result = calculateFinalResult()
  const keyCards = []

  if (result.key4 && (state.keys === '4k' || state.keys === 'both')) {
    keyCards.push(
      createKeyResultCard(
        '4키',
        result.key4,
        fourKeyShortRanks,
        fourKeyLongRanks,
        state.play4k,
      ),
    )
  }

  if (result.key7 && (state.keys === '7k' || state.keys === 'both')) {
    keyCards.push(
      createKeyResultCard(
        '7키',
        result.key7,
        sevenKeyRanks,
        sevenKeyRanks,
        state.play7k,
      ),
    )
  }

  app.innerHTML = `
    <main class="page">
      <section class="result-container">
        <div
          id="resultCaptureArea"
          class="result-capture rank-theme rank-${result.rank.toLowerCase()}"
        >
          <div class="page-header result-page-header">
            <p class="step">FINAL RESULT</p>
            <h2>${escapeHtml(state.name)}님의 재능상수는?</h2>
          </div>

          <section
            id="rankCard"
            class="final-rank-card"
            data-rank="${result.rank}"
          >
            <p class="final-rank-label">RANK</p>
            <strong class="final-rank">${result.rank}</strong>
            <p class="final-total">최종상수 총합 ${formatNumber(result.total)}</p>
            <p class="rank-mobile-description">
              ${getRankDescription(result.rank)}
            </p>
          </section>

          <section class="final-summary-grid">
            <div class="summary-card">
              <span>초기 재능상수</span>
              <strong>${formatNumber(result.basicTalent)}</strong>
            </div>

            <div class="summary-card">
              <span>최종 포인트</span>
              <strong>${formatNumber(result.finalPoint)}</strong>
            </div>

            <div class="summary-card">
              <span>키 세부 상수 총합</span>
              <strong>${formatNumber(result.keyConstantTotal)}</strong>
            </div>
          </section>

          <section class="key-results">
            ${keyCards.join('')}
          </section>


          <section id="selectedTraitsCard" class="selected-traits-card">
            <h3>선택한 후천적 특성</h3>

            <div class="selected-trait-group">
              <span>리듬재능특성</span>
              <p>${getSelectedTraitNames(state.selectedPerks, perks)}</p>
            </div>

            <div class="selected-trait-group">
              <span>리듬부정특성</span>
              <p>${getSelectedTraitNames(state.selectedFlaws, flaws)}</p>
            </div>
          </section>
        </div>

        <section class="download-card" data-html2canvas-ignore="true">
          <div>
            <h3>결과창 다운로드</h3>
            <p>결과를 세로형 PNG 이미지로 저장합니다.</p>
          </div>

          <label class="download-checkbox">
            <input id="hideTraitsCheckbox" type="checkbox" />
            <span>특성선택숨기기</span>
          </label>

          <button id="downloadButton" class="secondary-button" type="button">
            PNG 다운로드
          </button>
        </section>

        <div class="result-actions" data-html2canvas-ignore="true">
          <button id="editButton" class="secondary-button" type="button">
            특성 다시 선택
          </button>

          <button id="restartButton" class="primary-button" type="button">
            처음부터 다시 측정
          </button>
        </div>
      </section>

      <div id="rankTooltip" class="rank-tooltip"></div>
    </main>
  `

  document.querySelector('#editButton').addEventListener('click', renderPerksAndFlaws)
  document.querySelector('#restartButton').addEventListener('click', showRestartConfirmation)
  document.querySelector('#downloadButton').addEventListener('click', downloadResultImage)

  setupRankTooltip(result.rank)
}

async function downloadResultImage() {
  const captureArea = document.querySelector('#resultCaptureArea')
  const traitsCard = document.querySelector('#selectedTraitsCard')
  const hideTraits = document.querySelector('#hideTraitsCheckbox').checked
  const button = document.querySelector('#downloadButton')

  button.disabled = true
  button.textContent = '이미지 생성 중...'

  if (hideTraits) {
    traitsCard.classList.add('privacy-blur')
  }

  try {
    await waitForPaint()
    await waitForPaint()

    const canvas = await html2canvas(captureArea, {
      backgroundColor: '#0b0b0d',
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true,
      logging: false,
      onclone: (clonedDocument) => {
        if (!hideTraits) return

        const clonedTraitsCard =
          clonedDocument.querySelector('#selectedTraitsCard')

        if (clonedTraitsCard) {
          clonedTraitsCard.classList.add('privacy-blur', 'capture-privacy-mask')
        }
      },
    })

    const link = document.createElement('a')
    link.download = `${sanitizeFileName(state.name)}_osu_mania_재능상수.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error(error)
    alert('결과 이미지 생성에 실패했습니다.')
  } finally {
    traitsCard.classList.remove('privacy-blur')
    button.disabled = false
    button.textContent = 'PNG 다운로드'
  }
}

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

function setupRankTooltip(rank) {
  const card = document.querySelector('#rankCard')
  const tooltip = document.querySelector('#rankTooltip')

  if (!card || !tooltip) return

  tooltip.textContent = getRankDescription(rank)

  card.addEventListener('mouseenter', () => {
    tooltip.classList.add('is-visible')
  })

  card.addEventListener('mousemove', (event) => {
    tooltip.style.left = `${event.clientX + 16}px`
    tooltip.style.top = `${event.clientY + 16}px`
  })

  card.addEventListener('mouseleave', () => {
    tooltip.classList.remove('is-visible')
  })
}

function getRankDescription(rank) {
  const descriptions = {
    F: '상위 100%정도의 재능이네요.. 안타깝습니다..',
    D: '상위 85%정도의 재능이네요.. 다른게임이라도 알아볼까요?',
    C: '상위 60%정도의 재능입니다.. 가볍게 즐기는 정도가 좋겠네요.',
    B: '상위 50% 이상의 재능입니다. 평범한 매니아유저!',
    A: '상위 30% 이상의 재능입니다. 적당한 노력과 함께 즐거운 게임 되세요',
    S: '상위 10% 이상의 재능입니다. 게임좀 열심히해도 되겠는데요?',
    SS: '상위 1%의 재능입니다! 이미 끝내주는 실력을 가졌거나, 곧 가지게 되실겁니다!',
  }

  return descriptions[rank] || ''
}

function sanitizeFileName(value) {
  return String(value).replace(/[\\/:*?"<>|]/g, '_')
}

function createKeyResultCard(
  keyName,
  result,
  shortRanks,
  longRanks,
  currentPlay,
) {
  return `
    <article class="key-result-card">
      <div class="key-result-heading">
        <div>
          <p class="trait-kicker">${keyName.toUpperCase()} TALENT</p>
          <h3>당신은 향후 5년 이내에 높은 확률로...</h3>
        </div>

        <strong>${formatNumber(sumKeyConstants(result.constants))}</strong>
      </div>

      <div class="expected-rank-grid">
        ${createExpectedRankItem(
          '단놋 단위',
          currentPlay.shortRank,
          result.shortExpected,
          shortRanks,
        )}
        ${createExpectedRankItem(
          '롱놋 단위',
          currentPlay.longRank,
          result.longExpected,
          longRanks,
        )}
      </div>

      <div class="constant-grid">
        ${createConstantItem('처리재능', result.constants.processing)}
        ${createConstantItem('판정재능', result.constants.accuracy)}
        ${createConstantItem('단놋재능', result.constants.short)}
        ${createConstantItem('롱놋재능', result.constants.long)}
      </div>
    </article>
  `
}

function createExpectedRankItem(label, currentRank, expected, ranks) {
  if (expected === null) {
    return `
      <div class="expected-rank-item is-hidden-rank">
        <span>${label}</span>
        <strong>표시 안 함</strong>
        <small>플레이 안 함 선택</small>
      </div>
    `
  }

  const currentValue = rankToNumber(currentRank)
  const currentLabel = getRankLabel(currentValue, ranks)
  const expectedLabel = getRankLabel(expected, ranks)
  const keyType = ranks === sevenKeyRanks ? '7k' : '4k'

  return `
    <div class="expected-rank-item">
      <span>${label}</span>

      <div class="rank-growth">
        <strong class="unit-rank ${getUnitRankClass(keyType, currentValue)}">
          ${currentLabel}
        </strong>
        <span>›</span>
        <strong class="unit-rank unit-rank-result ${getUnitRankClass(keyType, expected)}">
          ${expectedLabel}
        </strong>
      </div>
    </div>
  `
}

function getUnitRankClass(keyType, value) {
  const rank = Number(value) || 0

  if (rank >= 1 && rank <= 10) {
    return `unit-pastel-${rank}`
  }

  if (keyType === '7k') {
    if (rank === 11) return 'unit-7k-gamma'
    if (rank === 12) return 'unit-7k-azimuth'
    if (rank === 13) return 'unit-7k-zenith'
    if (rank >= 14) return 'unit-7k-stellium'
    return 'unit-unranked'
  }

  const fourKeyClasses = {
    11: 'unit-4k-alpha',
    12: 'unit-4k-beta',
    13: 'unit-4k-luminal',
    14: 'unit-4k-gamma',
    15: 'unit-4k-tachyon',
    16: 'unit-4k-delta',
    17: 'unit-4k-epsilon',
    18: 'unit-4k-zeta',
    19: 'unit-4k-eta',
    20: 'unit-4k-theta',
    21: 'unit-4k-iota',
    22: 'unit-4k-kappa',
  }

  return fourKeyClasses[rank] || 'unit-unranked'
}

function createConstantItem(label, value) {
  return `
    <div class="constant-item">
      <span>${label}</span>
      <strong>${formatSignedNumber(value)}</strong>
    </div>
  `
}

function getSelectedTraitNames(ids, source) {
  if (ids.length === 0) {
    return '선택 없음'
  }

  return ids
    .map((id) => source.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join(', ')
}


function calculateFinalResult() {
  const basicResult = calculateBasicTalent()
  const pointResult = calculatePerkPoint()
  const keyResults = calculateAllKeyConstants()

  const key4Total = keyResults.key4
    ? sumKeyConstants(keyResults.key4.constants)
    : 0

  const key7Total = keyResults.key7
    ? sumKeyConstants(keyResults.key7.constants)
    : 0

  const keyConstantTotal = key4Total + key7Total

  const total =
    basicResult.basicTalent +
    pointResult.finalPoint +
    keyConstantTotal

  return {
    basicTalent: basicResult.basicTalent,
    finalPoint: pointResult.finalPoint,
    keyConstantTotal,
    total,
    rank: getFinalRank(total),
    key4: keyResults.key4,
    key7: keyResults.key7,
  }
}

function calculateAllKeyConstants() {
  const result = {
    key4: null,
    key7: null,
  }

  if (state.keys === '4k' || state.keys === 'both') {
    result.key4 = calculateKeyConstants('4k')
  }

  if (state.keys === '7k' || state.keys === 'both') {
    result.key7 = calculateKeyConstants('7k')
  }

  applyCrossKeyCareerBonus(result)
  applyMilitaryKeyBonus(result)
  applySelectedTraitStatEffects(result)

  const finalPoint = calculatePerkPoint().finalPoint

  if (result.key4) {
    result.key4.shortExpected = calculateExpectedRank({
      currentRank: state.play4k.shortRank,
      noteConstant: result.key4.constants.short,
      processingConstant: result.key4.constants.processing,
      pointValue: finalPoint,
      type: 'short',
      maxRank: 22,
    })

    result.key4.longExpected = calculateExpectedRank({
      currentRank: state.play4k.longRank,
      noteConstant: result.key4.constants.long,
      processingConstant: result.key4.constants.processing,
      pointValue: finalPoint,
      type: 'long',
      maxRank: 19,
    })

    const fourKeyYears = Number(state.play4k.years)
    const currentShortRank = rankToNumber(state.play4k.shortRank)
    const currentLongRank = rankToNumber(state.play4k.longRank)

    if (
      fourKeyYears <= 2 &&
      state.play4k.shortRank !== 'not-playing' &&
      currentShortRank < 10
    ) {
      result.key4.shortExpected = Math.max(
        result.key4.shortExpected,
        currentShortRank + 1,
      )
    }

    if (
      fourKeyYears <= 2 &&
      state.play4k.longRank !== 'not-playing' &&
      currentLongRank < 10
    ) {
      result.key4.longExpected = Math.max(
        result.key4.longExpected,
        currentLongRank + 1,
      )
    }
  }

  if (result.key7) {
    result.key7.shortExpected = calculateExpectedRank({
      currentRank: state.play7k.shortRank,
      noteConstant: result.key7.constants.short,
      processingConstant: result.key7.constants.processing,
      pointValue: finalPoint,
      type: 'short',
      maxRank: 15,
    })

    result.key7.longExpected = calculateExpectedRank({
      currentRank: state.play7k.longRank,
      noteConstant: result.key7.constants.long,
      processingConstant: result.key7.constants.processing,
      pointValue: finalPoint,
      type: 'long',
      maxRank: 15,
    })
  }

  return result
}

function calculateKeyConstants(key) {
  const age = Number(state.age)
  const play = key === '4k' ? state.play4k : state.play7k
  const years = Number(play.years)
  const shortRank = rankToNumber(play.shortRank)
  const longRank = rankToNumber(play.longRank)
  const shortPlaying = play.shortRank !== 'not-playing'
  const longPlaying = play.longRank !== 'not-playing'

  const constants = createEmptyConstants()

  applyInitialRankConstants(
    constants,
    key,
    shortRank,
    longRank,
    shortPlaying,
    longPlaying,
  )

  applyAgeBaseConstants(constants, key, age)

  if (key === '4k') {
    applyFourKeyRankBase(constants, shortRank, longRank, shortPlaying, longPlaying)
    applyFourKeyExperienceConstants(
      constants,
      age,
      years,
      shortRank,
      longRank,
      shortPlaying,
      longPlaying,
    )
  } else {
    applySevenKeyRankBase(constants, shortRank, longRank, shortPlaying, longPlaying)
    applySevenKeyExperienceConstants(
      constants,
      age,
      years,
      shortRank,
      longRank,
      shortPlaying,
      longPlaying,
    )
  }

  applyRankDifferencePenalty(
    constants,
    shortRank,
    longRank,
    shortPlaying,
    longPlaying,
  )

  return {
    constants,
    shortExpected: null,
    longExpected: null,
  }
}

function createEmptyConstants() {
  return {
    processing: 0,
    accuracy: 0,
    short: 0,
    long: 0,
  }
}

function applyInitialRankConstants(
  constants,
  key,
  shortRank,
  longRank,
  shortPlaying,
  longPlaying,
) {
  const rawShort = shortPlaying ? shortRank : 0
  const rawLong = longPlaying ? longRank : 0

  if (key === '4k') {
    const adjustedShort = rawShort >= 11 ? rawShort * 1.5 : rawShort
    const adjustedLong = rawLong >= 11 ? rawLong * 1.5 : rawLong

    constants.short += adjustedShort
    constants.long += adjustedLong
    constants.processing += (adjustedShort + adjustedLong) / 2
    return
  }

  const adjustedShort =
    rawShort >= 11 ? rawShort * 1.3 : rawShort * 1.2
  const adjustedLong =
    rawLong >= 11 ? rawLong * 1.3 : rawLong * 1.2

  constants.short += adjustedShort
  constants.long += adjustedLong
  constants.processing += (adjustedShort + adjustedLong) / 2
}

function applyAgeBaseConstants(constants, key, age) {
  if (age < 17) {
    addToAllConstants(constants, 10)
  }

  if (key === '4k' && age >= 25) {
    addToAllConstants(constants, -(5 + (age - 25)))
  }

  if (key === '7k' && age >= 30) {
    addToAllConstants(constants, -(3 + (age - 30)))
  }
}

function applyFourKeyRankBase(
  constants,
  shortRank,
  longRank,
  shortPlaying,
  longPlaying,
) {
  if (shortPlaying && shortRank >= 17) {
    addToAllConstants(constants, 7)
  }

  if (longPlaying && longRank >= 15) {
    constants.long += 7
    constants.processing += 7
  }
}

function applySevenKeyRankBase(
  constants,
  shortRank,
  longRank,
  shortPlaying,
  longPlaying,
) {
  if (shortPlaying && shortRank >= 13) {
    constants.short += 10
    constants.processing += 10
  }

  if (
    longPlaying &&
    longRank >= 13 &&
    (!shortPlaying || shortRank < 13)
  ) {
    constants.short -= 8
    constants.long += 10
  }
}

function applyFourKeyExperienceConstants(
  constants,
  age,
  years,
  shortRank,
  longRank,
  shortPlaying,
  longPlaying,
) {
  const experienceDelta = createEmptyConstants()
  let matchedExperienceRule = false

  if (years >= 4 && shortPlaying && shortRank >= 16) {
    experienceDelta.short += 5
    matchedExperienceRule = true
  }

  if (years <= 3) {
    if (shortPlaying && shortRank >= 17) {
      experienceDelta.processing += shortRank
      experienceDelta.short += shortRank
      matchedExperienceRule = true
    }

    if (longPlaying && longRank >= 17) {
      experienceDelta.processing += longRank
      experienceDelta.long += longRank
      matchedExperienceRule = true
    }
  }

  if (years >= 10) {
    if (shortPlaying && shortRank >= 1 && shortRank <= 16) {
      experienceDelta.processing -= 17 - shortRank
      matchedExperienceRule = true
    }

    if (longPlaying && longRank >= 1 && longRank <= 16) {
      experienceDelta.processing -= 17 - longRank
      matchedExperienceRule = true
    }
  }

  if (!shortPlaying) {
    experienceDelta.processing -= 3
    experienceDelta.short -= 10
    matchedExperienceRule = true
  }

  if (!longPlaying) {
    experienceDelta.processing -= 3
    experienceDelta.long -= 10
    matchedExperienceRule = true
  }

  if (
    years > 3 &&
    years < 10 &&
    (
      (shortPlaying && shortRank <= 10) ||
      (longPlaying && longRank <= 10)
    )
  ) {
    experienceDelta.processing -= 10
    matchedExperienceRule = true

    if (longRank < shortRank) {
      experienceDelta.long -= 8
    } else if (shortRank < longRank) {
      experienceDelta.long += 7
      experienceDelta.short -= 10
    }
  }

  if (years === 1 && !matchedExperienceRule) {
    addToAllConstants(experienceDelta, 2)
  }

  if (age < 17 && matchedExperienceRule) {
    doubleNegativeConstants(experienceDelta)
  }

  addConstants(constants, experienceDelta)

  if (age < 17 && years < 3) {
    addToAllConstants(constants, 18)
  }

  if (age >= 25 && years < 2) {
    addToAllConstants(constants, -(8 + (age - 25)))
  }
}

function applySevenKeyExperienceConstants(
  constants,
  age,
  years,
  shortRank,
  longRank,
  shortPlaying,
  longPlaying,
) {
  if (age < 20 && years < 2) {
    constants.long += age / 2
  }

  if (
    age >= 25 &&
    (
      (shortPlaying && shortRank < 11) ||
      (longPlaying && longRank < 11)
    )
  ) {
    constants.processing -= age
  }

  if (
    age >= 25 &&
    (
      (shortPlaying && shortRank >= 13) ||
      (longPlaying && longRank >= 13)
    )
  ) {
    addToAllConstants(constants, 7)
  }
}

function applyRankDifferencePenalty(
  constants,
  shortRank,
  longRank,
  shortPlaying,
  longPlaying,
) {
  if (!shortPlaying || !longPlaying) {
    return
  }

  const difference = Math.abs(shortRank - longRank)

  if (difference < 2) {
    return
  }

  if (shortRank < longRank) {
    constants.short -= difference
  } else {
    constants.long -= difference
  }
}

function getCrossKeyCareerBonus() {
  const fourYears =
    state.keys === '4k' || state.keys === 'both'
      ? Number(state.play4k.years)
      : 0

  const sevenYears =
    state.keys === '7k' || state.keys === 'both'
      ? Number(state.play7k.years)
      : 0

  if (Math.max(fourYears, sevenYears) < 10) {
    return 0
  }

  const fourRanks =
    state.keys === '4k' || state.keys === 'both'
      ? [
          rankToNumber(state.play4k.shortRank),
          rankToNumber(state.play4k.longRank),
        ]
      : []

  const sevenRanks =
    state.keys === '7k' || state.keys === 'both'
      ? [
          rankToNumber(state.play7k.shortRank),
          rankToNumber(state.play7k.longRank),
        ]
      : []

  const qualifiesForTen =
    fourRanks.some((rank) => rank >= 17) ||
    sevenRanks.some((rank) => rank >= 15)

  if (qualifiesForTen) {
    return 10
  }

  const qualifiesForSeven =
    fourRanks.some((rank) => rank >= 16) ||
    sevenRanks.some((rank) => rank >= 14)

  return qualifiesForSeven ? 7 : 0
}

function applyCrossKeyCareerBonus(keyResults) {
  const bonus = getCrossKeyCareerBonus()

  if (!bonus) return

  if (keyResults.key4) {
    addToAllConstants(keyResults.key4.constants, bonus)
  }

  if (keyResults.key7) {
    addToAllConstants(keyResults.key7.constants, bonus)
  }
}

function applyMilitaryKeyBonus(keyResults) {
  if (state.military !== 'exempt') return

  if (keyResults.key4) {
    addToAllConstants(keyResults.key4.constants, 3)
  }

  if (keyResults.key7) {
    addToAllConstants(keyResults.key7.constants, 3)
  }
}

function applySelectedTraitStatEffects(keyResults) {
  const selectedItems = [
    ...state.selectedPerks
      .map((id) => perks.find((item) => item.id === id)),
    ...state.selectedFlaws
      .filter((id) => id !== 'none')
      .map((id) => flaws.find((item) => item.id === id)),
  ].filter(Boolean)

  selectedItems.forEach((item) => {
    if (item.statEffects) {
      applyGenericStatEffects(keyResults, item.statEffects)
    }

    if (item.key4Effects && keyResults.key4) {
      applyEffectsToConstants(keyResults.key4.constants, item.key4Effects)
    }

    if (item.key7Effects && keyResults.key7) {
      applyEffectsToConstants(keyResults.key7.constants, item.key7Effects)
    }
  })
}

function applyGenericStatEffects(keyResults, effects) {
  if (keyResults.key4) {
    applyEffectsToConstants(keyResults.key4.constants, effects)
  }

  if (keyResults.key7) {
    applyEffectsToConstants(keyResults.key7.constants, effects)
  }
}

function applyEffectsToConstants(constants, effects) {
  Object.entries(effects).forEach(([key, value]) => {
    if (key in constants) {
      constants[key] += Number(value)
    }
  })
}

function addToAllConstants(constants, value) {
  constants.processing += value
  constants.accuracy += value
  constants.short += value
  constants.long += value
}

function addConstants(target, source) {
  target.processing += source.processing
  target.accuracy += source.accuracy
  target.short += source.short
  target.long += source.long
}

function doubleNegativeConstants(constants) {
  Object.keys(constants).forEach((key) => {
    if (constants[key] < 0) {
      constants[key] *= 2
    }
  })
}

function sumKeyConstants(constants) {
  return (
    constants.processing +
    constants.accuracy +
    constants.short +
    constants.long
  )
}

function rankToNumber(value) {
  if (value === 'not-playing' || value === 'unranked' || value === '') {
    return 0
  }

  return Number(value) || 0
}

function calculateExpectedRank({
  currentRank,
  noteConstant,
  processingConstant,
  pointValue,
  type,
  maxRank,
}) {
  if (currentRank === 'not-playing') {
    return null
  }

  const currentNumber = rankToNumber(currentRank)
  const product = noteConstant * processingConstant

  if (product <= 0) {
    return currentNumber
  }

  let addedConstant = 0

  if (type === 'short') {
    addedConstant =
      processingConstant > noteConstant
        ? processingConstant / 10
        : noteConstant / 8
  } else {
    const larger = Math.max(noteConstant, processingConstant)
    const smaller = Math.min(noteConstant, processingConstant)

    if (smaller <= 0) {
      return currentNumber
    }

    addedConstant = larger / smaller
  }

  const pointConstant = pointValue / 10
  const increase = Math.trunc((addedConstant + pointConstant) / 2)
  const predicted = currentNumber + increase

  return Math.min(maxRank, Math.max(currentNumber, predicted))
}

function getRankLabel(value, ranks) {
  const numericValue = Math.max(0, Number(value) || 0)

  if (numericValue === 0) {
    return '미취득'
  }

  const found = ranks.find(([rankValue]) => Number(rankValue) === numericValue)

  if (found) {
    return found[1]
  }

  const maximum = ranks[ranks.length - 1]
  return maximum ? maximum[1] : String(numericValue)
}

function getFinalRank(total) {
  if (total >= 91) return 'SS'
  if (total >= 80) return 'S'
  if (total >= 50) return 'A'
  if (total >= 30) return 'B'
  if (total >= 20) return 'C'
  if (total >= 10) return 'D'
  return 'F'
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function calculateBasicTalent() {
  const age = Number(state.age)

  const ageAdjustment =
    age <= 25
      ? roundToTwo((25 - age) * (15 / 24))
      : roundToTwo((25 - age) * (10 / 24))

  const genderAdjustmentMap = {
    male: 5,
    female: -5,
    other: 15,
  }

  const genderAdjustment = genderAdjustmentMap[state.gender] ?? 0

  const schoolMultiplierMap = {
    preschool: 2,
    elementary: 1.6,
    'elementary-graduate': 1.6,
    middle: 1.3,
    'middle-graduate': 1.3,
    high: 1,
    'high-graduate': 1,
    university: 0.95,
    'elementary-dropout': 5,
    'middle-dropout': 4,
    'high-dropout': 2.5,
    'university-dropout': 1,
  }

  const schoolMultiplier = schoolMultiplierMap[state.school] ?? 1

  const subtypeMultiplierMap = {
    general: 1,
    technical: 1.1,
    vocational: 1.05,
    gifted: 1.1,
    sky: 1.15,
    seoul: 1,
    regional: 0.95,
    junior: 0.9,
  }

  const subtypeMultiplier =
    subtypeMultiplierMap[state.schoolSubtype] ?? 1

  const minorMultiplier = age < 19 ? 2 : 1

  const jobAdjustmentMap = {
    employed: -5,
    unemployed: 5,
  }

  const jobAdjustment =
    age >= 19 ? jobAdjustmentMap[state.job] ?? 0 : 0

  const militaryAdjustmentMap = {
    active: 0,
    unserved: 2,
    public: 8,
    exempt: 0,
  }

  const militaryAdjustment =
    age >= 19 && state.gender === 'male'
      ? militaryAdjustmentMap[state.military] ?? 0
      : 0

  const multipliedValue =
    (1 + ageAdjustment) *
    schoolMultiplier *
    subtypeMultiplier *
    minorMultiplier

  const basicTalent =
    multipliedValue +
    genderAdjustment +
    jobAdjustment +
    militaryAdjustment

  const pointDivisor = age <= 10 || age >= 30 ? 3 : 2
  const initialPoint = basicTalent / pointDivisor

  return {
    ageAdjustment,
    genderAdjustment,
    schoolMultiplier,
    subtypeMultiplier,
    minorMultiplier,
    jobAdjustment,
    militaryAdjustment,
    basicTalent,
    initialPoint,
    pointDivisor,
  }
}

function roundToTwo(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function formatNumber(value) {
  return Number(value).toFixed(2)
}

function formatSignedNumber(value) {
  const number = Number(value)

  if (number > 0) {
    return `+${number.toFixed(2)}`
  }

  return number.toFixed(2)
}

function createRadioChoice(name, value, label, selectedValue) {
  const checked = value === selectedValue ? 'checked' : ''

  return `
    <label class="choice">
      <input
        type="radio"
        name="${name}"
        value="${value}"
        ${checked}
      />

      <span>${label}</span>
    </label>
  `
}

function createSchoolOptions(age) {
  const schools = [
    { value: 'preschool', label: '미취학' },
    { value: 'elementary', label: '초등학교 재학' },
    { value: 'elementary-graduate', label: '초등학교 졸업' },
    { value: 'middle', label: '중학교 재학' },
    { value: 'middle-graduate', label: '중학교 졸업' },
    { value: 'high', label: '고등학교 재학' },
    { value: 'high-graduate', label: '고등학교 졸업' },
    { value: 'university', label: '대학교' },
    { value: 'elementary-dropout', label: '초등학교 자퇴' },
    { value: 'middle-dropout', label: '중학교 자퇴' },
    { value: 'high-dropout', label: '고등학교 자퇴' },
    { value: 'university-dropout', label: '대학교 자퇴' },
  ]

  const availableSchools = schools.filter(({ value }) =>
    isSchoolAllowedForAge(value, age),
  )

  return `
    <option value="">선택해주세요</option>

    ${availableSchools
      .map(({ value, label }) => {
        const selected = value === state.school ? 'selected' : ''

        return `
          <option value="${value}" ${selected}>
            ${label}
          </option>
        `
      })
      .join('')}
  `
}

function isSchoolAllowedForAge(school, age) {
  if (!Number.isInteger(age) || age < 1 || age > 100) {
    return false
  }

  /*
   * 재학 상태는 실제로 재학할 수 있는 연령 구간만 표시합니다.
   * 졸업·자퇴 상태는 해당 학력을 얻거나 학교를 그만둘 수 있는
   * 최소 연령 이후부터 계속 선택할 수 있습니다.
   *
   * 예:
   * - 17세: 중학교 재학 가능
   * - 18세: 중학교 재학 불가, 중학교 졸업·자퇴 가능
   * - 23세: 초·중·고 졸업 및 자퇴 이력을 모두 선택 가능
   */
  const rules = {
    preschool: age >= 1 && age <= 7,

    elementary: age >= 8 && age <= 13,
    'elementary-graduate': age >= 14,
    'elementary-dropout': age >= 8,

    middle: age >= 14 && age <= 17,
    'middle-graduate': age >= 17,
    'middle-dropout': age >= 14,

    high: age >= 17 && age <= 20,
    'high-graduate': age >= 20,
    'high-dropout': age >= 17,

    university: age >= 20,
    'university-dropout': age >= 20,
  }

  return Boolean(rules[school])
}

function updateSchoolOptions() {
  const schoolSelect = document.querySelector('#schoolSelect')
  if (!schoolSelect) return

  const age = Number(state.age)

  if (state.school && !isSchoolAllowedForAge(state.school, age)) {
    state.school = ''
    state.schoolSubtype = ''
  }

  schoolSelect.innerHTML = createSchoolOptions(age)
}

function createOption(value, label, selectedValue) {
  const selected = value === selectedValue ? 'selected' : ''
  return `<option value="${value}" ${selected}>${label}</option>`
}

function createOrdinal(number) {
  const remainder10 = number % 10
  const remainder100 = number % 100

  if (remainder10 === 1 && remainder100 !== 11) {
    return `${number}st`
  }

  if (remainder10 === 2 && remainder100 !== 12) {
    return `${number}nd`
  }

  if (remainder10 === 3 && remainder100 !== 13) {
    return `${number}rd`
  }

  return `${number}th`
}

renderHome()
