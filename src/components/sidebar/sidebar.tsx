import { useRef } from "react";
import { TbBinaryTree2 } from "react-icons/tb";
import type { SidebarProps } from "@type/sidebar";
import { DownloadPDF } from "@hooks/download_pdf";
import {
  BiDownload,
  BiSolidTrashAlt,
  BiUpload,
  BiMenu,
  BiX,
} from "react-icons/bi";
import { HiUsers } from "react-icons/hi";
import { FaChildReaching } from "react-icons/fa6";

export function Sidebar({
  onAddedNode,
  selectedNode,
  isOpen,
  nodes,
  onToggle,
  onRemoveNode,
  edges,
  onLoadNodes,
}: SidebarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (json.nodes && Array.isArray(json.nodes)) {
        onLoadNodes({ nodes: json.nodes, edges: json.edges ?? [] });
        return;
      }

      if (Array.isArray(json)) {
        onLoadNodes({ nodes: json, edges: [] });
        return;
      }

      alert("Неверный формат JSON");
      console.error("Ошибка формата JSON:", json);
    } catch (error) {
      console.error("Ошибка при чтении JSON:", error);
      alert("Ошибка чтения файла");
    }
  }

  return (
    <>
      <header
        className={`
          bg-wrapper fixed h-[90vh] m-4 rounded-2xl shadow-lg p-4
          flex flex-col justify-start z-50 transition-all duration-300
          ${isOpen ? "w-[10%] items-start" : "w-[90px] items-center"}
          hidden md:flex
        `}
      >
        <input
          type="file"
          accept="application/json"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <button
          onClick={onToggle}
          className="mb-4 text-white bg-third/30 flex justify-center
          hover:bg-third/50 px-7 py-3 rounded-xl w-full text-2xl"
        >
          {isOpen ? (
            <BiX />
          ) : (
            <span>
              <BiMenu />
            </span>
          )}
        </button>

        <nav className="flex flex-col w-full">
          <div className="flex items-center gap-3 mb-6">
            <TbBinaryTree2 className="text-fourth text-5xl m-auto" />
            {isOpen && (
              <span className="text-fourth text-2xl font-semibold">
                Family Tree
              </span>
            )}
          </div>

          <ul className="list-none space-y-10">
            <li>
              <button
                type="button"
                onClick={() => onAddedNode("parent")}
                className="w-full flex items-center justify-center gap-2 px-7 py-3
                rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
              >
                {isOpen ? (
                  <>
                    <HiUsers className="size-10" />
                    <span className="font-light text-xl">Добавить родителей</span>
                  </>
                ) : (
                  <span>
                    <HiUsers className="size-8" />
                  </span>
                )}
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => onAddedNode("child")}
                className="w-full flex items-center justify-center gap-2 px-7 py-3
                rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
              >
                {isOpen ? (
                  <>
                    <FaChildReaching className="size-8" />
                    <span className="font-light text-xl">
                      Добавить ребёнка
                    </span>
                  </>
                ) : (
                  <span>
                    <FaChildReaching className="size-8" />
                  </span>
                )}
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() =>
                  selectedNode && onRemoveNode(selectedNode.node.id)
                }
                className="w-full flex items-center justify-center gap-2 px-7 py-3
                rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
              >
                {isOpen ? (
                  <>
                    <BiSolidTrashAlt className="size-6" />
                    <span className="font-light text-xl">Удалить</span>
                  </>
                ) : (
                  <span>
                    <BiSolidTrashAlt className="size-8" />
                  </span>
                )}
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => DownloadPDF(nodes, edges ?? [], svgRef.current!)}
                className="w-full flex items-center justify-center gap-2 px-7 py-3
                rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
              >
                {isOpen ? (
                  <>
                    <BiDownload className="size-8" />
                    <span className="font-light text-xl">Скачать</span>
                  </>
                ) : (
                  <span>
                    <BiDownload className="size-8" />
                  </span>
                )}
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-full flex items-center justify-center gap-2 px-7 py-3
                rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
              >
                {isOpen ? (
                  <>
                    <BiUpload className="size-8" />
                    <span className="font-light text-xl">Загрузить</span>
                  </>
                ) : (
                  <span>
                    <BiUpload className="size-8" />
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <header
        className="bg-wrapper fixed bottom-0 left-0 w-full h-16 flex items-center
      justify-between px-4 z-50 rounded-t-2xl shadow-lg md:hidden"
      >
        <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onAddedNode("parent")}
              className="flex items-center justify-center p-3 rounded-full bg-third/30 hover:bg-third/50 text-white"
            >
              <HiUsers className="text-xl" />
            </button>

            <button
              type="button"
              onClick={() => onAddedNode("child")}
              className="flex items-center justify-center p-3 rounded-full bg-third/30 hover:bg-third/50 text-white"
            >
              <FaChildReaching className="text-xl" />
            </button>

          <button
            type="button"
            onClick={() => selectedNode && onRemoveNode(selectedNode.node.id)}
            className="flex items-center justify-center p-3 rounded-full bg-third/30 hover:bg-third/50 text-white"
          >
            <BiSolidTrashAlt className="text-xl" />
          </button>

          <button
            type="button"
            onClick={() => DownloadPDF(nodes, edges ?? [], svgRef.current!)}
            className="flex items-center justify-center p-3 rounded-full bg-third/30 hover:bg-third/50 text-white"
          >
            <BiDownload className="text-xl" />
          </button>

          <button
            type="button"
            onClick={handleUploadClick}
            className="flex items-center justify-center p-3 rounded-full bg-third/30 hover:bg-third/50 text-white"
          >
            <BiUpload className="text-xl" />
          </button>
        </div>

        <input
          type="file"
          accept="application/json"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </header>
    </>
  );
}
