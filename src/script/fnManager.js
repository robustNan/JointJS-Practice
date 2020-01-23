import { JOINT_GRAPH, JOINT_PAPER, $PAPER } from './main';
import Stack from './stack';
import * as imgManager from './imgManager';

const [STACK_REDUCE, STACK_REDO] = [new Stack(), new Stack()]; //缓存绘图操作用到的栈
let [tempElement, toolsElement] = [null, null]; //创建图形时的临时变量

/**
 * @description 标记是否允许缓存操作
 * @type {Boolean}
 */
let permitCache = true;

function changeZoom(isIn) {
  const { sx: SX, sy: SY } = JOINT_PAPER.scale();
  const OPTIONS = JOINT_PAPER.options;
  let [x, y] = [0, 0];
  if (isIn) {
    [x, y] = [SX + 0.1, SY + 0.1];
    changeHolderSize(isIn, 0.1);
  } else {
    [x, y] = [SX - 0.1, SY - 0.1];
    //取小数点后一位防止浮点运算bug
    if (+x.toFixed(1) === 0.1 || +y.toFixed(1) === 0.1) return;
    changeHolderSize(isIn, 0.1);
  }
  const [N, R] = [x / SX, y / SY];
  JOINT_PAPER.scale(x, y);
  JOINT_PAPER.setOrigin(OPTIONS.origin.x * N, OPTIONS.origin.y * R);
  JOINT_PAPER.setDimensions(OPTIONS.width * N, OPTIONS.height * R);
}

function changeHolderSize(plus, cardinal) {
  const [CURRENT_H, CURRENT_W] = [
    +$PAPER
      .parent()
      .css('height')
      .replace(/[px]/g, ''),
    +$PAPER
      .parent()
      .css('width')
      .replace(/[px]/g, '')
  ];
  $PAPER.parent().css({
    height: plus ? CURRENT_H + 3000 * cardinal : CURRENT_H - 3000 * cardinal,
    width: plus ? CURRENT_W + 3000 * cardinal : CURRENT_W - 3000 * cardinal
  });
}

/**
 * @description 缓存用户绘制过程
 * @returns
 */
function cacheGraph() {
  if (!permitCache) return; //为false表示此时的变化是由还原或重做引发不做缓存
  const GRAPH_JSON_OBJECT = JOINT_GRAPH.toJSON();
  STACK_REDUCE.push(GRAPH_JSON_OBJECT);
  STACK_REDO.clear();
}

/**
 * @description 重做操作的执行方法
 * @returns
 */
function redoGraph() {
  const [REDO, CURRENT] = [STACK_REDO.pop(), JOINT_GRAPH.toJSON()];
  if (!REDO) return;
  STACK_REDUCE.push(REDO);
  if (_.isEqual(REDO, CURRENT)) {
    const GRAPH_JSON_OBJECT = STACK_REDO.pop();
    if (!GRAPH_JSON_OBJECT) return;
    permitCache = false;
    STACK_REDUCE.push(GRAPH_JSON_OBJECT);
    JOINT_GRAPH.fromJSON(GRAPH_JSON_OBJECT);
  } else {
    permitCache = false;
    JOINT_GRAPH.fromJSON(REDO);
  }
  setTimeout(() => {
    permitCache = true;
  }, 100);
}

/**
 * @description 还原操作的执行方法
 * @returns
 */
function reduceGraph() {
  permitCache = false;
  if (STACK_REDO.size() === 0) {
    const GRAPH_JSON_OBJECT = STACK_REDUCE.pop();
    STACK_REDO.push(GRAPH_JSON_OBJECT);
    const REDUCE = STACK_REDUCE.pop();
    if (REDUCE) {
      STACK_REDO.push(REDUCE);
      JOINT_GRAPH.fromJSON(REDUCE);
    } else {
      JOINT_GRAPH.clear();
    }
  } else {
    const REDUCE = STACK_REDUCE.pop();
    if (!REDUCE) {
      JOINT_GRAPH.clear();
      setTimeout(() => {
        permitCache = true;
      }, 100);
      return;
    }
    STACK_REDO.push(REDUCE);
    JOINT_GRAPH.fromJSON(REDUCE);
  }
  setTimeout(() => {
    permitCache = true;
  }, 100);
}

function addElementToPager(e, x, y) {
  this.position(e.offsetX, e.offsetY);
  this.addTo(JOINT_GRAPH);
  JOINT_PAPER.off('blank:pointerclick', addElementToPager, this);
}

function createElement(type) {
  const TEXT = {
    start: '开 始',
    stop: '结 束'
  };
  
  const IMAGES = {
    start: imgManager.icon_start,
    stop: imgManager.icon_stop
  };

  const ATTR = {
    root: { title: TEXT[type] },
    label: { text: TEXT[type] },
    border: { rx: 5, strokeWidth: 1 },
    image: { xlinkHref: IMAGES[type] }
  };
  if (tempElement) JOINT_PAPER.off('blank:pointerclick', addElementToPager, tempElement);
  tempElement = new joint.shapes.standard.BorderedImage();
  tempElement.resize(48, 48);
  tempElement.attr(ATTR);
  tempElement.set('nodeType', type);
  JOINT_PAPER.on('blank:pointerclick', addElementToPager, tempElement);
}

export { changeZoom, cacheGraph, redoGraph, reduceGraph };
export { createElement };
