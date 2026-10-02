import type { ComponentType } from "react";
import { ProductCinemaIndex, ProductCinemaDetail } from "../project-designs/ProductCinema";
import { InterfaceGalleryIndex, InterfaceGalleryDetail } from "../project-designs/InterfaceGallery";
import { ProductWorkbenchIndex, ProductWorkbenchDetail } from "../project-designs/ProductWorkbench";
import { ProductAtlasIndex, ProductAtlasDetail } from "../project-designs/ProductAtlas";
import { ProductStackIndex, ProductStackDetail } from "../project-designs/ProductStack";
import { ProductPlaygroundIndex, ProductPlaygroundDetail } from "../project-designs/ProductPlayground";
import type { ProjectStudy, StudyDirectionId } from "./data";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; nextStudy: ProjectStudy; direction: StudyDirectionId };
export const studyDesigns = {
  cinema: { Index: ProductCinemaIndex, Detail: ProductCinemaDetail }, gallery: { Index: InterfaceGalleryIndex, Detail: InterfaceGalleryDetail }, workbench: { Index: ProductWorkbenchIndex, Detail: ProductWorkbenchDetail }, atlas: { Index: ProductAtlasIndex, Detail: ProductAtlasDetail }, stack: { Index: ProductStackIndex, Detail: ProductStackDetail }, playground: { Index: ProductPlaygroundIndex, Detail: ProductPlaygroundDetail },
} satisfies Record<StudyDirectionId, { Index: ComponentType<IndexProps>; Detail: ComponentType<DetailProps> }>;
