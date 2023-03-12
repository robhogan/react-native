/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import invariant from 'assert';


class Node {
  id;
  children;
  state;

  constructor(id) {
    this.id = id;
    this.children = new Set();
    this.state = 'none';
  }
}

export class Graph {
  nodes;

  constructor() {
    this.nodes = new Map();
  }

  addNode(nodeId) {
    let node = this.nodes.get(nodeId);
    if (!node) {
      node = new Node(nodeId);
      this.nodes.set(nodeId, node);
    }
    return node;
  }

  addEdge(srcId, dstId) {
    const src = this.addNode(srcId);
    const dst = this.addNode(dstId);
    src.children.add(dst);
  }

  // traverse returns all nodes in the graph reachable from the given rootIds.
  // the returned nodes are topologically sorted, with the deepest nodes
  // returned first.
  traverse(rootIds) {
    // clear marks
    for (const node of this.nodes.values()) {
      node.state = 'none';
    }

    // make a fake root node that points to all the provided rootIds
    const root = new Node('root');
    for (const id of rootIds) {
      const node = this.nodes.get(id);
      invariant(node != null, `No node ${id} in graph`);
      root.children.add(node);
    }

    const output = [];
    postorder(root, output);

    // remove fake root node
    output.splice(-1);

    return output;
  }
}

function postorder(node, output) {
  if (node.state === 'visited') {
    return;
  }

  invariant(node.state !== 'visiting', `Not a DAG: cycle involving ${node.id}`);

  node.state = 'visiting';
  for (const child of node.children) {
    postorder(child, output);
  }

  node.state = 'visited';
  output.push(node.id);
}
