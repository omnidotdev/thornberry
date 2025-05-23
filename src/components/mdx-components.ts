import defaultMdxComponents from "fumadocs-ui/mdx";
import { BiErrorAlt } from "react-icons/bi";
import { FiCheck, FiDownload, FiInfo, FiUser } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertRoot,
  AlertTitle,
} from "@/registry/thornberry/components/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/registry/thornberry/components/avatar";
import { Badge } from "@/registry/thornberry/components/badge";
import { Button } from "@/registry/thornberry/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/registry/thornberry/components/card";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "@/registry/thornberry/components/checkbox";
import { Input } from "@/registry/thornberry/components/input";

import type { MDXComponents } from "mdx/types";

export const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertRoot,
    AlertTitle,
    Avatar,
    AvatarRoot,
    AvatarImage,
    AvatarFallback,
    Badge,
    BiErrorAlt,
    Button,
    Card,
    CardRoot,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CheckboxControl,
    CheckboxHiddenInput,
    CheckboxIndicator,
    CheckboxLabel,
    CheckboxRoot,
    FiCheck,
    FiDownload,
    FiInfo,
    FiUser,
    Input,
    IoWarningOutline,
    ...components,
  };
};
