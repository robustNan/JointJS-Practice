import * as joint from 'jointjs';
import $ from 'jquery';
import _ from 'lodash';

import '../style/index.styl';
//iconfont.css也可在index.style中引入
// import '../font/iconfont/iconfont.css';

import { changeZoom, cacheGraph, redoGraph, reduceGraph, createElement } from './fnManager';

const WRAP_DIV = document.querySelector('#wrap');
const [$WRAP, $PAPER] = [$(WRAP_DIV), $('#paper')];

let [_x, _y] = [0, 0];

$WRAP.scrollLeft((WRAP_DIV.scrollWidth - WRAP_DIV.offsetWidth) >> 1).scrollTop((WRAP_DIV.scrollHeight - WRAP_DIV.offsetHeight) >> 1);

window.joint = joint;

const JOINT_GRAPH = new joint.dia.Graph();
const JOINT_PAPER = new joint.dia.Paper({
  el: $PAPER.get(0),
  model: JOINT_GRAPH,
  width: 3000,
  height: 3000,
  gridSize: 10, //栅格点间距，元素拖动会捕捉栅格点
  drawGrid: {
    name: 'doubleMesh',
    args: [
      {
        color: '#dedede', //栅格点颜色
        scaleFactor: 1,
        thickness: 1 //栅格点大小
      },
      {
        color: '#dedede', //栅格点颜色
        scaleFactor: 10,
        thickness: 2 //栅格点大小
      }
    ]
  },
  background: {
    color: '#fff'
  },
  snapLinks: true,
  restrictTranslate: true //设定元素不能拖出画布
});

JOINT_GRAPH.on('add', cacheGraph);
JOINT_GRAPH.on('change ', _.debounce(cacheGraph, 300));
JOINT_GRAPH.on('remove', cacheGraph);

JOINT_PAPER.on('blank:pointerdown', (evt, x, y) => {
  [_x, _y] = [evt.offsetX, evt.offsetY];
  $PAPER.css('cursor', 'grabbing');
  $WRAP.on('mousemove', evt => {
    let scrollLeft = $WRAP.scrollLeft() - (evt.offsetX - _x);
    let scrollTop = $WRAP.scrollTop() - (evt.offsetY - _y);
    scrollLeft = 0 > scrollLeft ? 0 : scrollLeft;
    scrollTop = 0 > scrollTop ? 0 : scrollTop;
    $WRAP.scrollLeft(scrollLeft).scrollTop(scrollTop);
  });
});

JOINT_PAPER.on('blank:pointerup', (evt, x, y) => {
  $PAPER.css('cursor', 'grab');
  $WRAP.off('mousemove');
});

$('#zoom span').on('click', e => {
  changeZoom(e.target.className.includes('in'));
});

$('#tools>span').on('click', function(e) {
  const $LIST = $(this).prev('ul');
  if (parseInt($LIST.css('width'), 10) === 0) {
    const WIDTH = $LIST.children().length * 40 + 'px';
    $LIST.animate({ width: WIDTH, paddingLeft: '20px' });
  } else {
    $LIST.animate({ width: 0, paddingLeft: 0 });
  }
});

$('#tools>ul>li').on('click', function() {
  createElement(this.id);
});

$(document).on('keydown', e => {
  if (e.ctrlKey === true && e.keyCode === 89) {
    /* Ctrl + Y */
    redoGraph();
  } else if (e.ctrlKey === true && e.keyCode === 90) {
    /* Ctrl + Z */
    reduceGraph();
  } else if (e.ctrlKey === true && e.keyCode === 188) {
    /* Ctrl + ,*/
    changeZoom(false);
  } else if (e.ctrlKey === true && e.keyCode === 190) {
    /* Ctrl + .*/
    changeZoom(true);
  }
});

export { JOINT_GRAPH, JOINT_PAPER, $PAPER };
