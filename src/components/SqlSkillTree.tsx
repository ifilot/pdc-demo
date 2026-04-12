import { useMemo, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import {
  cardHeight,
  cardWidth,
  connectors,
  getLectureContent,
  getModuleById,
  getPrerequisites,
  leafModuleIds,
  moduleList,
  positionedModules,
  treeBounds,
  type Module,
} from "../data/sqlTree";
import { useLearningProgress } from "../hooks/useLearningProgress";

function getConnectorState({
  fromId,
  toId,
  hoveredId,
  prerequisiteIds,
  isCompleted,
  isReady,
}: {
  fromId: string;
  toId: string;
  hoveredId: string | null;
  prerequisiteIds: Set<string>;
  isCompleted: (moduleId: string) => boolean;
  isReady: (module: Module) => boolean;
}) {
  const bothCompleted = isCompleted(fromId) && isCompleted(toId);
  const isNextToLearn = isReady(getModuleById(toId)!);
  const isInHoveredPath =
    Boolean(hoveredId) &&
    prerequisiteIds.has(fromId) &&
    (prerequisiteIds.has(toId) || toId === hoveredId);

  if (isInHoveredPath) {
    if (bothCompleted) {
      return { stroke: "#4caf50", opacity: 0.78 };
    }
    if (isNextToLearn) {
      return { stroke: "#ffd84d", opacity: 0.9 };
    }
    return { stroke: "#e84421", opacity: 0.85 };
  }

  if (hoveredId) {
    return { stroke: "#a7afb7", opacity: 0.18 };
  }

  if (bothCompleted) {
    return { stroke: "#4caf50", opacity: 0.72 };
  }

  if (isNextToLearn) {
    return { stroke: "#ffd84d", opacity: 0.55 };
  }

  return { stroke: "#a7afb7", opacity: 0.24 };
}

function getNodeClassNames({
  module,
  hoveredId,
  prerequisiteIds,
  isCompleted,
  isReady,
}: {
  module: Module;
  hoveredId: string | null;
  prerequisiteIds: Set<string>;
  isCompleted: (moduleId: string) => boolean;
  isReady: (module: Module) => boolean;
}) {
  const isHovered = hoveredId === module.id;
  const isPrerequisite = prerequisiteIds.has(module.id);
  const isSomethingHovered = Boolean(hoveredId);
  const ready = isReady(module);
  const completed = isCompleted(module.id);

  return [
    "course-node",
    `node-${module.type}`,
    completed ? "state-completed" : ready ? "state-ready" : "state-locked",
    isHovered ? "is-hovered" : "",
    isPrerequisite ? "is-prerequisite" : "",
    isSomethingHovered && !isHovered && !isPrerequisite ? "is-dimmed" : "",
    leafModuleIds.has(module.id) && getLectureContent(module.id) ? "is-clickable" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function CourseRoadmap() {
  const { isCompleted, isReadyToLearn } = useLearningProgress();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const prerequisiteIds = useMemo(
    () => (hoveredId ? getPrerequisites(hoveredId) : new Set<string>()),
    [hoveredId],
  );

  function goTo(path: string) {
    window.location.assign(`${import.meta.env.BASE_URL}#${path}`);
  }

  return (
    <div className={`course-tree-shell ${hoveredId ? "is-hovering" : ""}`}>
      <TransformWrapper
        initialScale={1}
        minScale={0.35}
        maxScale={2}
        centerOnInit
        limitToBounds={false}
        wheel={{ step: 0.06 }}
        doubleClick={{ mode: "zoomIn" }}
        panning={{ excluded: ["button", "a"] }}
      >
        {({ zoomIn, zoomOut, resetTransform, centerView }) => (
          <>
            <div className="tree-controls">
              <button type="button" onClick={() => zoomIn(0.15)}>
                +
              </button>
              <button type="button" onClick={() => zoomOut(0.15)}>
                -
              </button>
              <button type="button" onClick={() => resetTransform()}>
                Reset
              </button>
              <button type="button" onClick={() => centerView(1)}>
                Center
              </button>
            </div>

            <div className="tree-legend">
              <div className="legend-item">
                <span className="legend-card concept">◧</span>
                Theory topic
              </div>
              <div className="legend-item">
                <span className="legend-card skill">⚙</span>
                Applied topic
              </div>
              <div className="legend-item">
                <span className="legend-dot completed" />
                Completed
              </div>
            </div>

            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{
                width: "100%",
                minHeight: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <div
                className="tree-stage"
                style={{ width: treeBounds.width, height: treeBounds.height }}
              >
                <svg
                  className="tree-svg"
                  width={treeBounds.width}
                  height={treeBounds.height}
                  viewBox={`0 0 ${treeBounds.width} ${treeBounds.height}`}
                  aria-hidden="true"
                >
                  {connectors.map((connector) => {
                    const state = getConnectorState({
                      fromId: connector.from,
                      toId: connector.to,
                      hoveredId,
                      prerequisiteIds,
                      isCompleted,
                      isReady: isReadyToLearn,
                    });

                    return (
                      <path
                        key={`${connector.from}-${connector.to}`}
                        d={connector.d}
                        stroke={state.stroke}
                        opacity={state.opacity}
                      />
                    );
                  })}
                </svg>

                {moduleList.map((module) => {
                  const positionedModule = positionedModules[module.id];
                  const lecture = getLectureContent(module.id);
                  const isLeafLecture = leafModuleIds.has(module.id) && Boolean(lecture);
                  const completed = isCompleted(module.id);

                  return (
                    <button
                      key={module.id}
                      type="button"
                      className={getNodeClassNames({
                        module,
                        hoveredId,
                        prerequisiteIds,
                        isCompleted,
                        isReady: isReadyToLearn,
                      })}
                      style={{
                        width: cardWidth,
                        height: cardHeight,
                        left: positionedModule.position.x - cardWidth / 2,
                        top: positionedModule.position.y - cardHeight / 2,
                      }}
                      onMouseEnter={() => setHoveredId(module.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => {
                        if (isLeafLecture) {
                          goTo(`/lecture/${module.id}`);
                          return;
                        }
                        goTo(`/module/${module.id}`);
                      }}
                    >
                      <span className="node-badge">{module.type === "concept" ? "◧" : "⚙"}</span>
                      {completed && <span className="node-check">✓</span>}
                      <span className="node-title">{module.name}</span>
                      <span className="node-hint">
                        {isLeafLecture ? "Open lecture" : module.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
