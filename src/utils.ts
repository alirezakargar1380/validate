export function join(path: any, prefix: any) {
    return prefix
        ? `${prefix}.${path}`
        : path;
}

// export function enumerate(path: any, obj: any, callback: any) {
//     const parts = path.split(/\.\$(?=\.|$)/);
//     const first = parts.shift();
//     const arr = dot.get(obj, first);
  
//     if (!parts.length) {
//       return callback(first, arr);
//     }
  
//     if (!Array.isArray(arr)) {
//       return;
//     }
  
//     for (let i = 0; i < arr.length; i++) {
//       const current = join(i, first);
//       const next = current + parts.join('.$');
//       enumerate(next, obj, callback);
//     }
//   }