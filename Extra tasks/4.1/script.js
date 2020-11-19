class List {
    constructor (root) {
        this.root = root;
    }

    print () {
        let el = this.root;
        if (!el.next) {
            console.log (el.value);
            return;
        }
        console.log(el.value);
        while (el.next) {
            el = el.next;
            console.log(el.value);
        }
    }

    addNode(value, i) {
        let el = this.root;
        if (arguments[1] === undefined) {
            if (!el.next) {
                el.next = new Node (null, value)
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
                el.next = new Node (null, value)
                return true;
            }
            if (countEl < i) return false
            el = this.root;
            for (let j = 0; j < i + 1; j++) {
                el = el.next;
            }
            let node = new Node (el.next, el.value);
            console.log(node);
            el.next = node;
            el.value = value;
            return true;
        }
    }
}

class Node {
    constructor (next, value) {
        this.next = next;
        this.value = value;
    }
}

let node6 = new Node (null, 6);
let node5 = new Node (node6, 5);
let node4 = new Node (node5, 4);
let node3 = new Node (node4, 3);
let node2 = new Node (node3, 2);
let node1 = new Node (node2, 1)
let root = new Node (null, 0);
let list = new List (root);