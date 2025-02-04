let pos = {x: null, y: null}; 
let diff = {x: null, y: null}; 
let mouseDown = false; 
let selectedItem = null; 
let resetTransition = false; 
let transitionTime = 400; 
const itemsEle = document.querySelector('.items');

const numOfItems = document.querySelectorAll('.items .item').length;

document.querySelector('.items').style.height = (numOfItems * 70) + (numOfItems * 10) + 'px';

function positionItems(insertIndex = null){
    let itemsList = document.querySelectorAll('.items .item'); itemsList = Array.prototype.slice.call(itemsList); itemsList = itemsList.filter(item => item.getAttribute('selected') !== 'yes');
    let indexCounter = 0;
    itemsList.forEach(function(item){
        if(insertIndex === indexCounter + 1){
            indexCounter++;
        }
        item.style.top = (70 * indexCounter) + (indexCounter * 10) + 'px';
        item.setAttribute('order', indexCounter + 1);
        indexCounter++;
    });
}
positionItems();

function positionItemsInOrder(){
    let itemsList = document.querySelectorAll('.items .item'); itemsList = Array.prototype.slice.call(itemsList); 
    itemsList = itemsList.sort(function(a, b){
        return Number(a.getAttribute('order')) > Number(b.getAttribute('order')) ? 1 : -1;
    });
    itemsList.forEach(function(item, index){
        if(item.getAttribute('selected') === 'yes'){
            item.removeAttribute('selected');
            item.style.left = '0';
            setTimeout(function(){
                item.style.zIndex = '0';
            }, transitionTime);
        };
        item.style.top = (70 * index) + (index * 10) + 'px';
        item.setAttribute('order', index + 1);
    });
    resetTransition = true;
    
    setTimeout(function(){
        while(itemsEle.firstChild){
            itemsEle.removeChild(itemsEle.lastChild);
        };
        itemsList.forEach(function(item){
            itemsEle.append(item);
        });
        resetTransition = false;
    }, transitionTime);
}

document.querySelectorAll('.items .item').forEach(function(item, index){
    item.addEventListener('mousedown', function(e){
        if(!pos.x || resetTransition) return;
        mouseDown = true, selectedItem = item;
        diff.y = pos.y - item.offsetTop, diff.x = pos.x - item.offsetLeft;
        let offsetY = pos.y - diff.y, offsetX = pos.x - diff.x;
        item.style.top = offsetY + 'px';
        item.style.left = offsetX  + 'px';
        item.style.zIndex = '1000';
        item.setAttribute('selected', 'yes');
    });
    item.addEventListener('mouseup', function(e){
        mouseDown = false;
        positionItemsInOrder();
    });
});

addEventListener('mousemove', function(e){
    pos.x = e.clientX - itemsEle.offsetLeft, pos.y = e.clientY - (itemsEle.offsetTop - window.scrollY); 
    if(!mouseDown) return;
    let offsetY = pos.y - diff.y, offsetX = pos.x - diff.x;
    selectedItem.style.top = offsetY + 'px';
    selectedItem.style.left = offsetX + 'px';
    // let itemsList = document.querySelectorAll('.items .item'); itemsList = Array.prototype.slice.call(itemsList); itemsList = itemsList.filter(item => item.getAttribute('selected') !== 'yes');
    let orderOfSelectedItem = Number(selectedItem.getAttribute('order'));
   
    if(orderOfSelectedItem !== 1){
        let beforeItem = document.querySelector(`.items .item[order*="${orderOfSelectedItem - 1}"]`);
        let beforeMiddle = pos.y < beforeItem.offsetTop + (beforeItem.clientHeight / 2);
        if(beforeMiddle){
            positionItems(orderOfSelectedItem - 1);
            selectedItem.setAttribute('order', orderOfSelectedItem - 1);
            return;
        }
    };
    if(orderOfSelectedItem !== document.querySelectorAll('.items .item').length){
        let afterItem = document.querySelector(`.items .item[order*="${orderOfSelectedItem + 1}"]`);
        let afterMiddle = pos.y > afterItem.offsetTop + (afterItem.clientHeight / 2);
        if(afterMiddle){
            positionItems(orderOfSelectedItem + 1);
            selectedItem.setAttribute('order', orderOfSelectedItem + 1);
            return;
        }
    };
});