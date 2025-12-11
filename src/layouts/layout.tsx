/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import type { NodeProps } from "@type/node";
import type { Link } from "@type/canvas_area";
import { CanvasArea } from "@features/canvas_area";
import { Sidebar } from "@components/sidebar/sidebar";
import { BiZoomIn, BiZoomOut } from "react-icons/bi";

export function Layout() {
  const [zoom, setZoom] = useState<number>(1);
  const [edges, setEdges] = useState<Link[]>([]);
  const [nodes, setNodes] = useState<NodeProps[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedNodeID, setSelectedNodeID] = useState<number | null>(null);

  const counterID = useRef<number>(1);
  function generateID() {
    const id = counterID.current;
    counterID.current += 1;
    return id;
  }

  function zoomIn() {
    setZoom((z) => Math.min(2.5, z + 0.1));
  }

  function zoomOut() {
    setZoom((z) => Math.max(0.3, z - 0.1));
  }

  function loadNodesFromJSON(data: { nodes: any[]; edges: Link[] }) {
    const fixedNodes = data.nodes.map((n: any) => ({
      node: n.node ? n.node : n,
      onMouseDown: () => {},
    }));

    fixedNodes.forEach((n) => {
      if (n.node.x === undefined) n.node.x = 2500;
      if (n.node.y === undefined) n.node.y = 2500;
    });

    setNodes(fixedNodes);
    setEdges(data.edges);

    if (fixedNodes.length > 0) {
      setSelectedNodeID(fixedNodes[0].node.id);
    }

    const maxIdInData = fixedNodes.reduce(
      (acc, cur) => Math.max(acc, cur.node.id ?? 0),
      0
    );
    const maxIdInEdges = data.edges.reduce(
      (acc, cur) => Math.max(acc, cur.from, cur.to),
      0
    );
    const maxId = Math.max(maxIdInData, maxIdInEdges, counterID.current - 1);
    counterID.current = Math.max(counterID.current, maxId + 1);
  }

  function addNode(type: "parent" | "child" = "parent") {
    if (selectedNodeID === null) {
      const container = document.getElementById("board");
      let x = 400;
      let y = 100;

      if (container) {
        x = container.scrollLeft + container.clientWidth / 2 / zoom;
        y = container.scrollTop + container.clientHeight / 2 / zoom;
      }

      const meID = generateID();
      setNodes((prev) => [
        ...prev,
        { node: { id: meID, name: "Я", x, y }, onMouseDown: () => {} },
      ]);
      setSelectedNodeID(meID);
      return;
    }

    const parentNode = nodes.find((n) => n.node.id === selectedNodeID);
    if (!parentNode) return;

    if (type === "child") {
      const childID = generateID();

      const child: NodeProps = {
        node: {
          id: childID,
          name: `Ребёнок ${childID}`,
          x: parentNode.node.x,
          y: parentNode.node.y + 200,
        },
        onMouseDown: () => {},
      };

      setNodes((prev) => [...prev, child]);
      setEdges((prev) => [...prev, { from: selectedNodeID, to: childID }]);

      return;
    }

    if (type === "parent") {
      const baseX = parentNode.node.x;
      const baseY = parentNode.node.y - 200;

      const motherID = generateID();
      const fatherID = generateID();

      const mother: NodeProps = {
        node: {
          id: motherID,
          name: `Родитель ${motherID}`,
          x: baseX - 120,
          y: baseY,
        },
        onMouseDown: () => {},
      };

      const father: NodeProps = {
        node: {
          id: fatherID,
          name: `Родитель ${fatherID}`,
          x: baseX + 120,
          y: baseY,
        },
        onMouseDown: () => {},
      };

      setNodes((prev) => [...prev, mother, father]);

      setEdges((prevEdges) => [
        ...prevEdges,
        { from: motherID, to: parentNode.node.id },
        { from: fatherID, to: parentNode.node.id },
      ]);

      return;
    }
  }

  function changeName(newName: string) {
    if (selectedNodeID === null) return;

    setNodes((prev) =>
      prev.map((n) =>
        n.node.id === selectedNodeID
          ? { ...n, node: { ...n.node, name: newName } }
          : n
      )
    );
  }

  function getDescendants(startID: number, edgesList: Link[]): number[] {
    const result = new Set<number>();
    const stack: number[] = [startID];

    while (stack.length > 0) {
      const current = stack.pop();
      if (current === undefined) continue;

      const children = edgesList
        .filter((e) => e.from === current)
        .map((e) => e.to);
      for (const childID of children) {
        if (!result.has(childID)) {
          result.add(childID);
          stack.push(childID);
        }
      }
    }

    result.delete(startID);
    return Array.from(result);
  }

  function getAncestors(startID: number, edgesList: Link[]): number[] {
    const result = new Set<number>();
    const stack: number[] = [startID];

    while (stack.length > 0) {
      const current = stack.pop();
      if (current === undefined) continue;

      const parents = edgesList
        .filter((e) => e.to === current)
        .map((e) => e.from);
      for (const parentID of parents) {
        if (!result.has(parentID)) {
          result.add(parentID);
          stack.push(parentID);
        }
      }
    }

    result.delete(startID);
    return Array.from(result);
  }

  function removeNode(id: number) {
    const selectedNode = nodes.find((n) => n.node.id === id);
    if (!selectedNode) return;

    let idsToRemove = new Set<number>();

    if (selectedNode.node.name === "Я") {
      const descendants = getDescendants(id, edges);
      const ancestors = getAncestors(id, edges);
      idsToRemove = new Set<number>([id, ...descendants, ...ancestors]);
    } else {
      const ancestors = getAncestors(id, edges);
      idsToRemove = new Set<number>([id, ...ancestors]);
    }

    const newEdges = edges.filter(
      (e) => !idsToRemove.has(e.from) && !idsToRemove.has(e.to)
    );
    const newNodes = nodes.filter((n) => !idsToRemove.has(n.node.id));

    const newSelectedNodeID =
      selectedNodeID !== null && idsToRemove.has(selectedNodeID)
        ? null
        : selectedNodeID;

    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNodeID(newSelectedNodeID);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        onAddedNode={addNode}
        isOpen={sidebarOpen}
        edges={edges}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        selectedNode={nodes.find((n) => n.node.id === selectedNodeID)}
        onRemoveNode={removeNode}
        onChangeName={changeName}
        nodes={nodes}
        onLoadNodes={loadNodesFromJSON}
      />

      <CanvasArea
        zoom={zoom}
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        selectedNodeID={selectedNodeID}
        onSelectNode={setSelectedNodeID}
      />

      <div
        className="xs:hidden md:flex flex-col w-auto p-2 bg-wrapper
        rounded-3xl absolute right-20 top-130 justify-center items-center"
      >
        <button onClick={zoomIn} className="text-white lg:cursor-pointer">
          <BiZoomIn className="size-10" />
        </button>

        <hr className="border-2 border-primary mx-auto w-9 my-5" />

        <button
          onClick={zoomOut}
          className="text-white lg:cursor-pointer active:bg-primary/40"
        >
          <BiZoomOut className="size-10" />
        </button>
      </div>
    </div>
  );
}
