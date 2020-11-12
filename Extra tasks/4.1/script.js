class Node {
    constructor (value,next) {
        this.next = next;
        this.value = value;
    }
}

class List {
    constructor (root) {
        this.value = root;
    }

    addNode (value, i) {
        let el = this;
        if (arguments[1] === undefined) {
            if (!el.next) {
                el.next = new Node (value, lastNode)
                return true;
            }
            while (el.next) {
                el = el.next;
            }
            el.value = value;
            el.next = new Node (null, null);
            return true;
        } else {
            let countEl = 0
            while (el.next) {
                el = el.next;
                countEl++;
            }
            if (i === 0 && countEl === 0) {
                el.next = new Node (value, lastNode)
                return true;
            }
            if (countEl < i) return false
            el = this;
            for (let j = 0; j < i+1; j++) {
                el = el.next;
            }
            let node = new Node (el.value, el.next);
            el.value = value;
            el.next = node;
            return true;
        }
        return true;
    }

    removeNode (i) {
        let el = this;
        if (el.next === null) {
            return false;
        }
        if (i === 0) {
            let list = this;
            console.log (this)
            let node = this.next;
            this.value = this.next.value;
            this.next = this.next.next;
            return true;
        }
        if (arguments.length === 0) {
            while (el.next.next !== null) {
                el = el.next;
            }
            el.next = null;
            el.value = null;
            return true;
        } else {
            let countEl = 0
             while (el.next) {
                el = el.next;
                countEl++;
            }
            if (countEl < i) return false
            el = this;
            for (let j = 0; j < i-1; j++) {
                el = el.next;
            }
            let node = el.next.next;
            el.next = node;
            return true;
        }        
    }

    print () {
        let el = this;
        if (!el.next) {
            console.log (el.value);
            return;
        }
        while (el.next) {
            console.log(el.value);
            el = el.next;
        }
    }
}

let myList = new List (-5);
let lastNode = new Node (8, null);
let node8 = new Node (7, lastNode);
let node7 = new Node (6, node8);
let node6 = new Node (5, node7);
let node5 = new Node (4, node6);
let node4 = new Node (3, node5);
let node3 = new Node (2, node4);
let node2 = new Node (1, node3);
let node1 = new Node (0, node2)
myList['next'] = node1;

let testList = new List (100);
testList.next = null;
//myList.print();
//myList.addNode(8);


