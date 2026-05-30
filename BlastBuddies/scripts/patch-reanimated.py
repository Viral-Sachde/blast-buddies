#!/usr/bin/env python3
"""
Patches react-native-reanimated 3.x Android Java sources to remove old-arch
code that references APIs removed in React Native 0.82+.

Deleted files (old-arch only, replaced by C++/JSI in new arch):
  ReaLayoutAnimator.java, ReanimatedUIManager.java,
  ReanimatedUIImplementation.java, ReanimatedUIManagerFactory.java

Patched files (references to the deleted classes removed):
  ReanimatedModule.java, ReanimatedPackage.java,
  ReanimatedNativeHierarchyManager.java, TabNavigatorObserver.java
"""
import os, re, sys

BASE = os.path.join(
    os.path.dirname(__file__),
    "../node_modules/react-native-reanimated/android/src/main/java/com/swmansion/reanimated",
)


def fp(*parts):
    return os.path.join(BASE, *parts)


def read(path):
    if not os.path.exists(path):
        print(f"  skip (missing): {path}")
        return None
    with open(path) as f:
        return f.read()


def write(path, content):
    with open(path, "w") as f:
        f.write(content)
    print(f"  patched: {os.path.relpath(path, BASE)}")


def delete(path):
    if os.path.exists(path):
        os.remove(path)
        print(f"  deleted: {os.path.relpath(path, BASE)}")


# ── 1. Delete old-arch-only files ────────────────────────────────────────────
print("Deleting old-arch files …")
for f in [
    "layoutReanimation/ReaLayoutAnimator.java",
    "layoutReanimation/ReanimatedUIManager.java",
    "layoutReanimation/ReanimatedUIImplementation.java",
    "ReanimatedUIManagerFactory.java",
]:
    delete(fp(f))

# ── 2. ReanimatedModule.java ──────────────────────────────────────────────────
# Remove UIManagerModuleListener import + implements + listener registration +
# willDispatchViewUpdates @Override method.
print("Patching ReanimatedModule.java …")
src = read(fp("ReanimatedModule.java"))
if src:
    src = src.replace("import com.facebook.react.uimanager.UIManagerModuleListener;\n", "")
    src = src.replace(", UIManagerModuleListener", "")
    # addUIManagerListener call
    src = re.sub(r"[ \t]*uiManager\.addUIManagerListener\(this\);\n", "", src)
    # removeUIManagerListener call (may span the line with combineRunnables)
    src = re.sub(
        r"[ \t]*Utils\.combineRunnables\([^;]*removeUIManagerListener[^;]*\);\n",
        "",
        src,
    )
    # @Override willDispatchViewUpdates method — match @Override + method body
    src = re.sub(
        r"\n[ \t]*@Override\n[ \t]*public void willDispatchViewUpdates\([^)]*\)[^{]*\{[^}]*\}",
        "",
        src,
        flags=re.DOTALL,
    )
    write(fp("ReanimatedModule.java"), src)

# ── 3. ReanimatedPackage.java ─────────────────────────────────────────────────
# Remove ReanimatedUIManager import, class references, and the case branch.
print("Patching ReanimatedPackage.java …")
src = read(fp("ReanimatedPackage.java"))
if src:
    src = src.replace("import com.facebook.react.uimanager.ReanimatedUIManager;\n", "")
    # Three occurrences of ReanimatedUIManager.class (with leading/trailing commas)
    src = re.sub(r",\s*ReanimatedUIManager\.class", "", src)
    src = re.sub(r"ReanimatedUIManager\.class\s*,?\s*", "", src)
    # case ReanimatedUIManager.NAME -> createUIManager(reactContext);
    src = re.sub(r"[ \t]*case ReanimatedUIManager\.NAME[^\n]*\n", "", src)
    # createUIManager private helper method
    src = re.sub(
        r"\n[ \t]*private[^(]+createUIManager[^{]*\{[^}]*\}",
        "",
        src,
        flags=re.DOTALL,
    )
    # Belt-and-suspenders: remove any remaining line mentioning ReanimatedUIManagerFactory
    src = re.sub(r"[^\n]*ReanimatedUIManagerFactory[^\n]*\n", "", src)
    write(fp("ReanimatedPackage.java"), src)

# ── 4. ReanimatedNativeHierarchyManager.java ──────────────────────────────────
print("Patching ReanimatedNativeHierarchyManager.java …")
src = read(fp("layoutReanimation/ReanimatedNativeHierarchyManager.java"))
if src:
    src = re.sub(r"[ \t]*private final ReaLayoutAnimator mReaLayoutAnimator;\n", "", src)
    src = re.sub(r"[ \t]*mReaLayoutAnimator = new ReaLayoutAnimator\([^)]*\);\n", "", src)
    # if (indicesToRemove != null && mReaLayoutAnimator instanceof ReaLayoutAnimator) { ... }
    src = re.sub(
        r"[ \t]*if\s*\(indicesToRemove\s*!=\s*null\s*&&\s*mReaLayoutAnimator\s*instanceof\s*ReaLayoutAnimator\)[^}]*\}[ \t]*\n",
        "",
        src,
        flags=re.DOTALL,
    )
    # Remove any other remaining mReaLayoutAnimator references
    src = re.sub(r"[^\n]*\bmReaLayoutAnimator\b[^\n]*\n", "", src)
    write(fp("layoutReanimation/ReanimatedNativeHierarchyManager.java"), src)

# ── 5. TabNavigatorObserver.java ──────────────────────────────────────────────
print("Patching TabNavigatorObserver.java …")
src = read(fp("layoutReanimation/TabNavigatorObserver.java"))
if src:
    src = re.sub(r"[ \t]*private final ReaLayoutAnimator mReaLayoutAnimator;\n", "", src)
    src = re.sub(
        r"public TabNavigatorObserver\(\s*ReaLayoutAnimator \w+\s*\)",
        "public TabNavigatorObserver()",
        src,
    )
    src = re.sub(r"[ \t]*this\.mReaLayoutAnimator = \w+;\n", "", src)
    # Remove any remaining mReaLayoutAnimator or ReaLayoutAnimator references
    src = re.sub(r"[^\n]*\b(?:mReaLayoutAnimator|ReaLayoutAnimator)\b[^\n]*\n", "", src)
    write(fp("layoutReanimation/TabNavigatorObserver.java"), src)

print("\nreact-native-reanimated patched successfully for RN 0.85 new arch.")
