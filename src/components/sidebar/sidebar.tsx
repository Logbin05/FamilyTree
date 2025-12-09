import { useRef, useState } from "react";
import { TbBinaryTree2 } from "react-icons/tb";
import type { SidebarProps } from "@type/sidebar";
import { DownloadPDF } from "@hooks/download_pdf";
import {
  BiDownload,
  BiMenu,
  BiPlus,
  BiSolidTrashAlt,
  BiUpload,
  BiX,
} from "react-icons/bi";

export function Sidebar({
  onAddedNode,
  selectedNode,
  isOpen,
  nodes,
  onToggle,
  onRemoveNode,
  onSaveNode,
  edges,
  onLoadNodes,
}: SidebarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    birthYear: "",
    location: "",
    biography: "",
    avatar: "",
  });

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


  function handleSave() {
    if (!selectedNode) return;
    onSaveNode(selectedNode.node.id, {
      name: formData.name,
      age: Number(formData.age),
      birthYear: Number(formData.birthYear),
      location: formData.location,
      biography: formData.biography,
    });
    setEditing(false);
  }

  return (
    <header
      className={`
        bg-wrapper fixed h-[90vh] m-4 rounded-2xl shadow-lg p-4
        flex flex-col justify-start z-9999
        transition-all duration-300
        ${isOpen ? "w-[20%] items-start" : "w-[60px] items-center"}
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
        className="mb-4 text-white bg-third/30 flex justify-center hover:bg-third/50 px-3 py-2 rounded-xl w-full text-2xl"
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
          <TbBinaryTree2 className="text-fourth text-3xl" />
          {isOpen && (
            <span className="text-fourth text-2xl font-semibold">
              Family Tree
            </span>
          )}
        </div>

        {isOpen && selectedNode && editing && (
          <div className="bg-primary/20 p-3 rounded-xl mb-4 space-y-2">
            <input
              type="text"
              placeholder="Имя"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-2 py-1 rounded border"
            />
            <input
              type="text"
              placeholder="Год рождения"
              value={formData.birthYear}
              onChange={(e) =>
                setFormData({ ...formData, birthYear: e.target.value })
              }
              className="w-full px-2 py-1 rounded border"
            />
            <input
              type="text"
              placeholder="Место жительства"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-2 py-1 rounded border"
            />
            <textarea
              placeholder="Биография"
              value={formData.biography}
              onChange={(e) =>
                setFormData({ ...formData, biography: e.target.value })
              }
              className="w-full px-2 py-1 rounded border"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-500 px-3 py-1 rounded text-white"
              >
                Сохранить
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-red-500 px-3 py-1 rounded text-white"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        <ul className="list-none space-y-3">
          <li>
            <button
              type="button"
              onClick={onAddedNode}
              className="w-full flex items-center justify-center gap-2 px-4 py-2
                 rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
            >
              {isOpen ? (
                <>
                  <BiPlus />
                  <span className="font-medium">Добавить ветку</span>
                </>
              ) : (
                <span>
                  <BiPlus />
                </span>
              )}
            </button>
          </li>
          <hr className="border border-primary mx-auto w-9" />

          <li>
            <button
              type="button"
              onClick={() => selectedNode && onRemoveNode(selectedNode.node.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2
                 rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
            >
              {isOpen ? (
                <>
                  <BiSolidTrashAlt />
                  <span className="font-medium">Удалить</span>
                </>
              ) : (
                <span>
                  <BiSolidTrashAlt className="size-5" />
                </span>
              )}
            </button>
          </li>

          <hr className="border border-primary mx-auto w-9" />

          <li>
            <button
              type="button"
              onClick={() => DownloadPDF(nodes, edges ?? [], svgRef.current!)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
            >
              {isOpen ? (
                <>
                  <BiDownload />
                  <span className="font-medium">Скачать</span>
                </>
              ) : (
                <span>
                  <BiDownload className="size-5" />
                </span>
              )}
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={handleUploadClick}
              className="w-full flex items-center justify-center gap-2
                px-4 py-2 rounded-xl bg-third/30 hover:bg-third/50
                transition-all duration-200 text-white"
            >
              {isOpen ? (
                <>
                  <BiUpload />
                  <span className="font-medium">Загрузить</span>
                </>
              ) : (
                <>
                  <span>
                    <BiUpload className="size-5" />
                  </span>
                </>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
