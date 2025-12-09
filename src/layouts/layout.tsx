/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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

    fixedNodes.forEach((n: any) => {
      if (n.node.x === undefined) n.node.x = 2500;
      if (n.node.y === undefined) n.node.y = 2500;
    });

    setNodes(fixedNodes);
    setEdges(data.edges);

    if (fixedNodes.length > 0) {
      setSelectedNodeID(fixedNodes[0].node.id);
    }
  }

  function addNode() {
    if (selectedNodeID === null) {
      const container = document.getElementById("board");
      let x = 400;
      let y = 100;

      if (container) {
        x = container.scrollLeft + container.clientWidth / 2 / zoom;
        y = container.scrollTop + container.clientHeight / 2 / zoom;
      }

      const meID = nodes.length + 1;
      setNodes((prev) => [
        ...prev,
        {
          node: { id: meID, name: "Я", x: x, y: y },
          onMouseDown: () => {},
        },
      ]);
      setSelectedNodeID(meID);
      return;
    }

    const parent = nodes.find((n) => n.node.id === selectedNodeID);
    if (!parent) return;

    const baseX = parent.node.x;
    const baseY = parent.node.y - 200;

    const motherID = nodes.length + 1;
    const fatherID = nodes.length + 2;

    const father: NodeProps = {
      node: {
        id: fatherID,
        name: `Родитель ${fatherID}`,
        x: baseX - 100,
        y: baseY,
      },
      onMouseDown: () => {},
    };
    const mother: NodeProps = {
      node: {
        id: motherID,
        name: `Родитель ${motherID}`,
        x: baseX + 100,
        y: baseY,
      },
      onMouseDown: () => {},
    };

    setNodes((prev) => [...prev, mother, father]);

    setEdges((prev) => [
      ...prev,
      { from: parent.node.id, to: motherID },
      { from: parent.node.id, to: fatherID },
    ]);
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

  function removeNode(id: number) {
    setNodes((prev) => prev.filter((n) => n.node.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));

    if (selectedNodeID === id) setSelectedNodeID(null);
  }

  function saveNode(id: number, data: Partial<NodeProps["node"]>) {
    setNodes((prev) =>
      prev.map((n) =>
        n.node.id === id ? { ...n, node: { ...n.node, ...data } } : n
      )
    );
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
        onSaveNode={saveNode}
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
        rounded-3xl absolute right-20 top-130"
      >
        <button onClick={zoomIn} className="text-white lg:cursor-pointer">
          <BiZoomIn className="size-10" />
        </button>

        <hr className="border-2 border-primary mx-auto w-9 my-5" />

        <button onClick={zoomOut} className="text-white lg:cursor-pointer">
          <BiZoomOut className="size-10" />
        </button>
      </div>
    </div>
  );
}
