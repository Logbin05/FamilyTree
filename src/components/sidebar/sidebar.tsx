import { useRef, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { TbBinaryTree2 } from "react-icons/tb";
import type { SidebarProps } from "@type/sidebar";
import { DownloadPDF } from "@hooks/download_pdf";

export function Sidebar({
  onAddedNode,
  selectedNode,
  isOpen,
  nodes,
  onToggle,
  onRemoveNode,
  onSaveNode,
}: SidebarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    birthYear: "",
    location: "",
    biography: "",
    avatar: "",
  });

  function handleEditClick() {
    if (!selectedNode) return;
    setFormData({
      name: selectedNode.node.name || "",
      age: selectedNode.node.age?.toString() || "",
      birthYear: selectedNode.node.birthYear?.toString() || "",
      location: selectedNode.node.location || "",
      biography: selectedNode.node.biography || "",
      avatar: selectedNode.node.avatar || "",
    });
    setEditing(true);
  }

  function handleSave() {
    if (!selectedNode) return;
    onSaveNode(selectedNode.node.id, {
      name: formData.name,
      age: Number(formData.age),
      birthYear: Number(formData.birthYear),
      location: formData.location,
      biography: formData.biography,
      avatar: formData.avatar,
    });
    setEditing(false);
  }

  return (
    <header
      className={`
        bg-wrapper fixed h-[90vh] m-4 rounded-2xl shadow-lg p-4
        flex flex-col justify-start
        transition-all duration-300
        ${isOpen ? "w-[20%] items-start" : "w-[60px] items-center"}
      `}
    >
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
              ➕{isOpen && <span className="font-medium">Добавить ветку</span>}
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={handleEditClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2
                 rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
            >
              ✏️{isOpen && <span className="font-medium">Редактировать</span>}
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => selectedNode && onRemoveNode(selectedNode.node.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2
                 rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
            >
              🗑️{isOpen && <span className="font-medium">Удалить</span>}
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => DownloadPDF(nodes, svgRef.current!)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-third/30 hover:bg-third/50 transition-all duration-200 text-white"
            >
              ⬇️{isOpen && <span className="font-medium">Скачать</span>}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
