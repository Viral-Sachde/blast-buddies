#!/usr/bin/env python3
"""
Patches react-native-reanimated 3.x Android Java sources to remove old-arch
code that references APIs removed in React Native 0.82+.
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


def remove_lines_containing(src, *snippets):
    """Remove every line that contains any of the given substrings."""
    lines = src.splitlines(keepends=True)
    result = []
    for line in lines:
        if any(s in line for s in snippets):
            continue
        result.append(line)
    return "".join(result)


def remove_method(src, signature_fragment):
    """
    Remove a method whose signature contains `signature_fragment`.
    Handles nested braces. Also removes a preceding @Override if present.
    """
    lines = src.splitlines(keepends=True)
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if signature_fragment in line:
            # Walk back to eat the preceding @Override line (if any)
            if result and "@Override" in result[-1]:
                result.pop()
            # Walk forward to consume the method body (balanced braces)
            depth = 0
            found_open = False
            while i < len(lines):
                for ch in lines[i]:
                    if ch == "{":
                        depth += 1
                        found_open = True
                    elif ch == "}":
                        depth -= 1
                if found_open and depth == 0:
                    i += 1
                    break
                i += 1
        else:
            result.append(line)
            i += 1
    return "".join(result)


def remove_if_block(src, condition_fragment):
    """Remove an if-block whose condition contains `condition_fragment`."""
    lines = src.splitlines(keepends=True)
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if condition_fragment in line and line.lstrip().startswith("if"):
            depth = 0
            found_open = False
            while i < len(lines):
                for ch in lines[i]:
                    if ch == "{":
                        depth += 1
                        found_open = True
                    elif ch == "}":
                        depth -= 1
                if found_open and depth == 0:
                    i += 1
                    break
                i += 1
        else:
            result.append(line)
            i += 1
    return "".join(result)


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
print("Patching ReanimatedModule.java …")
src = read(fp("ReanimatedModule.java"))
if src:
    src = remove_lines_containing(
        src,
        "import com.facebook.react.uimanager.UIManagerModuleListener",
        "addUIManagerListener",
        "removeUIManagerListener",
    )
    src = src.replace(", UIManagerModuleListener", "")
    src = remove_method(src, "willDispatchViewUpdates")
    write(fp("ReanimatedModule.java"), src)

# ── 3. ReanimatedPackage.java ─────────────────────────────────────────────────
print("Patching ReanimatedPackage.java …")
src = read(fp("ReanimatedPackage.java"))
if src:
    src = remove_lines_containing(
        src,
        "import com.facebook.react.uimanager.ReanimatedUIManager",
        "ReanimatedUIManager.class",
        "ReanimatedUIManager.NAME",
        "ReanimatedUIManagerFactory",
    )
    src = remove_method(src, "createUIManager")
    write(fp("ReanimatedPackage.java"), src)

# ── 4. ReanimatedNativeHierarchyManager.java ──────────────────────────────────
print("Patching ReanimatedNativeHierarchyManager.java …")
src = read(fp("layoutReanimation/ReanimatedNativeHierarchyManager.java"))
if src:
    src = remove_lines_containing(
        src,
        "ReaLayoutAnimator",
        "mReaLayoutAnimator",
    )
    src = remove_if_block(src, "mReaLayoutAnimator instanceof ReaLayoutAnimator")
    write(fp("layoutReanimation/ReanimatedNativeHierarchyManager.java"), src)

# ── 5. TabNavigatorObserver.java ──────────────────────────────────────────────
print("Patching TabNavigatorObserver.java …")
src = read(fp("layoutReanimation/TabNavigatorObserver.java"))
if src:
    src = remove_lines_containing(src, "ReaLayoutAnimator", "mReaLayoutAnimator")
    # Fix the constructor signature that referenced ReaLayoutAnimator
    src = re.sub(
        r"public TabNavigatorObserver\([^)]*\)",
        "public TabNavigatorObserver()",
        src,
    )
    write(fp("layoutReanimation/TabNavigatorObserver.java"), src)

print("\nreact-native-reanimated patched successfully for RN 0.85 new arch.")
