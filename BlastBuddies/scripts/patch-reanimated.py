#!/usr/bin/env python3
"""
Patches react-native-reanimated 3.x Android Java sources to remove old-arch
code that references APIs removed in React Native 0.82+.
"""
import os, re

BASE = os.path.join(
    os.path.dirname(__file__),
    "../node_modules/react-native-reanimated/android/src/main/java/com/swmansion/reanimated",
)


def fp(*parts):
    return os.path.join(BASE, *parts)


def read(path):
    if not os.path.exists(path):
        print(f"  skip (missing): {os.path.basename(path)}")
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


def drop_lines(*snippets):
    """Return a filter fn that drops lines containing ANY of the snippets."""
    def _filter(src):
        return "\n".join(
            line for line in src.splitlines()
            if not any(s in line for s in snippets)
        ) + "\n"
    return _filter


def remove_method(src, signature_fragment):
    """
    Remove the method whose signature contains `signature_fragment`.
    Handles arbitrary nesting. Also eats the preceding @Override line.
    """
    lines = src.splitlines(keepends=True)
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if signature_fragment in line:
            # eat preceding @Override
            if out and "@Override" in out[-1]:
                out.pop()
            # eat method body (balanced braces)
            depth, found = 0, False
            while i < len(lines):
                for ch in lines[i]:
                    if ch == "{":
                        depth += 1
                        found = True
                    elif ch == "}":
                        depth -= 1
                if found and depth == 0:
                    i += 1
                    break
                i += 1
        else:
            out.append(line)
            i += 1
    return "".join(out)


def remove_if_block(src, condition_fragment):
    """Remove an if-block whose condition line contains `condition_fragment`."""
    lines = src.splitlines(keepends=True)
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if condition_fragment in line and line.lstrip().startswith("if"):
            depth, found = 0, False
            while i < len(lines):
                for ch in lines[i]:
                    if ch == "{":
                        depth += 1
                        found = True
                    elif ch == "}":
                        depth -= 1
                if found and depth == 0:
                    i += 1
                    break
                i += 1
        else:
            out.append(line)
            i += 1
    return "".join(out)


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
# • Remove UIManagerModuleListener import line
# • Remove addUIManagerListener / removeUIManagerListener statement lines
# • Remove ", UIManagerModuleListener" from the implements clause (same-line fix)
# • Remove the willDispatchViewUpdates @Override method
print("Patching ReanimatedModule.java …")
src = read(fp("ReanimatedModule.java"))
if src:
    src = drop_lines(
        "import com.facebook.react.uimanager.UIManagerModuleListener",
        "addUIManagerListener",
        "removeUIManagerListener",
    )(src)
    src = src.replace(", UIManagerModuleListener", "")
    src = remove_method(src, "willDispatchViewUpdates")
    write(fp("ReanimatedModule.java"), src)

# ── 3. ReanimatedPackage.java ─────────────────────────────────────────────────
# • Remove import line
# • Remove "case ReanimatedUIManager.NAME" line (safe: whole statement)
# • SURGICALLY remove ReanimatedUIManager.class from comma lists
#   (NOT drop_lines — the class appears on a line with valid other entries)
# • Remove createUIManager helper method
print("Patching ReanimatedPackage.java …")
src = read(fp("ReanimatedPackage.java"))
if src:
    src = drop_lines(
        "import com.facebook.react.uimanager.ReanimatedUIManager",
        "ReanimatedUIManager.NAME",
    )(src)
    # Surgically strip ReanimatedUIManager.class from class lists
    src = re.sub(r",\s*ReanimatedUIManager\.class", "", src)
    src = re.sub(r"ReanimatedUIManager\.class\s*,\s*", "", src)
    src = re.sub(r"ReanimatedUIManager\.class", "", src)
    src = remove_method(src, "createUIManager")
    write(fp("ReanimatedPackage.java"), src)

# ── 4. ReanimatedNativeHierarchyManager.java ──────────────────────────────────
# Order matters:
# 1. remove_if_block FIRST (needs the condition line intact to find the block)
# 2. then drop individual lines referencing the deleted class
print("Patching ReanimatedNativeHierarchyManager.java …")
src = read(fp("layoutReanimation/ReanimatedNativeHierarchyManager.java"))
if src:
    src = remove_if_block(src, "mReaLayoutAnimator instanceof ReaLayoutAnimator")
    src = drop_lines("ReaLayoutAnimator", "mReaLayoutAnimator")(src)
    write(fp("layoutReanimation/ReanimatedNativeHierarchyManager.java"), src)

# ── 5. TabNavigatorObserver.java ──────────────────────────────────────────────
# • Drop field declaration and any reference lines
# • Fix constructor to remove ReaLayoutAnimator parameter
print("Patching TabNavigatorObserver.java …")
src = read(fp("layoutReanimation/TabNavigatorObserver.java"))
if src:
    src = drop_lines("ReaLayoutAnimator", "mReaLayoutAnimator")(src)
    # Wipe whatever constructor params remain (they only referenced ReaLayoutAnimator)
    src = re.sub(
        r"public TabNavigatorObserver\([^)]*\)",
        "public TabNavigatorObserver()",
        src,
    )
    write(fp("layoutReanimation/TabNavigatorObserver.java"), src)

print("\nreact-native-reanimated patched successfully for RN 0.85 new arch.")
