/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Reference} from '../../imports';
import {ClassDeclaration} from '../../reflection';

import {DirectiveMeta, MetadataReader, MetadataRegistry, NgModuleMeta, PipeMeta} from './api';

/**
 * A registry of directive, pipe, and module metadata for types defined in the current compilation
 * unit, which supports both reading and registering.
 */
export class LocalMetadataRegistry implements MetadataRegistry, MetadataReader {
  private abstractDirectives = new Set<ClassDeclaration>();
  private directives = new Map<ClassDeclaration, DirectiveMeta>();
  private ngModules = new Map<ClassDeclaration, NgModuleMeta>();
  private pipes = new Map<ClassDeclaration, PipeMeta>();

  isAbstractDirective(ref: Reference<ClassDeclaration>): boolean {
    return this.abstractDirectives.has(ref.node);
  }
  getDirectiveMetadata(ref: Reference<ClassDeclaration>): DirectiveMeta|null {
    return this.directives.has(ref.node) ? this.directives.get(ref.node) ! : null;
  }
  getNgModuleMetadata(ref: Reference<ClassDeclaration>): NgModuleMeta|null {
    return this.ngModules.has(ref.node) ? this.ngModules.get(ref.node) ! : null;
  }
  getPipeMetadata(ref: Reference<ClassDeclaration>): PipeMeta|null {
    return this.pipes.has(ref.node) ? this.pipes.get(ref.node) ! : null;
  }

  registerAbstractDirective(clazz: ClassDeclaration): void { this.abstractDirectives.add(clazz); }
  registerDirectiveMetadata(meta: DirectiveMeta): void { this.directives.set(meta.ref.node, meta); }
  registerNgModuleMetadata(meta: NgModuleMeta): void { this.ngModules.set(meta.ref.node, meta); }
  registerPipeMetadata(meta: PipeMeta): void { this.pipes.set(meta.ref.node, meta); }
}

/**
 * A `MetadataRegistry` which registers metdata with multiple delegate `MetadataRegistry` instances.
 */
export class CompoundMetadataRegistry implements MetadataRegistry {
  constructor(private registries: MetadataRegistry[]) {}

  registerAbstractDirective(clazz: ClassDeclaration) {
    for (const registry of this.registries) {
      registry.registerAbstractDirective(clazz);
    }
  }

  registerDirectiveMetadata(meta: DirectiveMeta): void {
    for (const registry of this.registries) {
      registry.registerDirectiveMetadata(meta);
    }
  }

  registerNgModuleMetadata(meta: NgModuleMeta): void {
    for (const registry of this.registries) {
      registry.registerNgModuleMetadata(meta);
    }
  }

  registerPipeMetadata(meta: PipeMeta): void {
    for (const registry of this.registries) {
      registry.registerPipeMetadata(meta);
    }
  }
}
