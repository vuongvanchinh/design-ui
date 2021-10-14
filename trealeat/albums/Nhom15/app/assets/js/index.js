$(document).ready(() => {
    
})






















const ele = $('.view')[0];
ele.scrollTop = 100;
ele.scrollLeft = 150;
let pos = { top: 0, left: 0, x: 0, y: 0 };

const mouseDownHandler = function (e) {
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';

    pos = {
        // The current scroll
        left: ele.scrollLeft,
        top: ele.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
};

const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');
};

const focus = (id) => {
    let el = $(id)
    let w = el.width()
    
    let h = el.height()
    let screen_w = $(window).innerWidth()
    let screen_h = $(window).innerHeight()
    console.log(w, h, el.scrollTop, el.scrollHeight);
    console.log(screen_w, screen_h);
    
}