import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssignmentDetails,
  submitAssignment,
} from "../../../api/studentApi";
import { QUERY_KEYS } from "../../../constants/queries";
import {
  Loader2,
  Info,
  CheckCircle,
  UploadCloud,
  FileText,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../../store/useAppStore";
import type { AssignmentDetails } from "../../../api/schemas/studentSchemas";

const AssignmentView: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const addToast = useAppStore((s) => s.addToast);

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const { data: assignment, isLoading } = useQuery({
    queryKey: QUERY_KEYS.assignmentDetails(assignmentId!),
    queryFn: () => getAssignmentDetails(assignmentId!),
    enabled: !!assignmentId,
  });

  const mutation = useMutation({
    mutationFn: submitAssignment,
    onSuccess: (newSubmission) => {
      queryClient.setQueryData(
        QUERY_KEYS.assignmentDetails(assignmentId!),
        (oldData: AssignmentDetails | undefined) =>
          oldData ? { ...oldData, submission: newSubmission } : oldData
      );
      addToast({
        message: "Assignment submitted successfully!",
        type: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        message: error.message || "Submission failed.",
        type: "error",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentId || (!text && !file)) {
      addToast({
        message: "Please provide a text response or a file.",
        type: "error",
      });
      return;
    }
    mutation.mutate({ assignmentId, text, file: file || undefined });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!assignment) return <div>Assignment not found.</div>;

  const isSubmitted = !!assignment.submission;
  // Narrow submission to a local const for safer access and clearer guards
  const submission = assignment.submission;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-text mb-1">
        {assignment.title}
      </h1>
      <p className="text-sm text-brand-text-alt mb-6">
        {t("views.assignmentView.course")}: {assignment.course}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions */}
          <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
            <h2 className="text-lg font-semibold text-brand-text mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-brand-primary" />
              {t("views.assignmentView.instructions")}
            </h2>
            <p className="text-brand-text-alt whitespace-pre-wrap">
              {assignment.instructions}
            </p>
          </div>

          {/* Submission Form / Status */}
          {isSubmitted && submission ? (
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {t("views.assignmentView.yourSubmission")}
              </h2>
              <p className="font-semibold">
                {t("views.assignmentView.status")}:{" "}
                <span className="font-normal">
                  {submission.submittedAt
                    ? t("views.assignmentView.statusSubmittedOn", {
                        date: new Date(submission.submittedAt).toLocaleString(),
                      })
                    : ""}
                </span>
              </p>
              {submission.submittedText && (
                <div className="mt-2">
                  <h3 className="font-semibold text-sm">
                    {t("views.assignmentView.submittedText")}:
                  </h3>
                  <p className="text-sm p-2 bg-brand-surface rounded-md mt-1">
                    {submission.submittedText}
                  </p>
                </div>
              )}
              {submission.submittedFile && (
                <div className="mt-2">
                  <h3 className="font-semibold text-sm">
                    {t("views.assignmentView.submittedFile")}:
                  </h3>
                  <div className="flex items-center gap-2 text-sm p-2 bg-brand-surface rounded-md mt-1">
                    <FileText className="w-4 h-4 text-brand-primary" />
                    <span>
                      {submission.submittedFile.name} (
                      {(submission.submittedFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg"
          >
            <h2 className="text-lg font-semibold text-brand-text mb-4">
              {isSubmitted
                ? t("views.assignmentView.updateButton")
                : t("views.assignmentView.submitWork")}
            </h2>
            <div className="space-y-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("views.assignmentView.textResponsePlaceholder")}
                className="w-full h-32 p-2 border border-brand-border rounded-md bg-brand-surface"
                disabled={mutation.isPending}
              />
              <div>
                <label className="block text-sm font-medium text-brand-text-alt">
                  {t("views.assignmentView.fileUploadLabel")}
                </label>
                {file ? (
                  <div className="mt-2 flex items-center justify-between p-3 bg-brand-surface rounded-lg border border-brand-primary">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-6 h-6 text-brand-primary flex-shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-brand-text truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-brand-text-alt">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      disabled={mutation.isPending}
                      className="p-1.5 rounded-full text-brand-text-alt hover:bg-red-500/10 hover:text-red-500"
                      aria-label="Clear file selection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${isDraggingOver ? "border-brand-primary bg-brand-primary/10" : "border-brand-border dark:border-dark-border hover:border-brand-primary"}`}
                  >
                    <div className="text-center">
                      <UploadCloud className="mx-auto h-10 w-10 text-brand-text-alt dark:text-dark-text-alt" />
                      <div className="mt-4 flex text-sm leading-6 text-brand-text-alt dark:text-dark-text-alt">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-brand-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2 hover:text-brand-primary-hover"
                        >
                          <span>Choose a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            disabled={mutation.isPending}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-brand-text-alt/80 dark:text-dark-text-alt/80">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mutation.isPending
                  ? t("views.assignmentView.submittingButton")
                  : isSubmitted
                    ? t("views.assignmentView.updateButton")
                    : t("views.assignmentView.submitButton")}
              </button>
            </div>
          </form>
        </div>

        {/* Info sidebar */}
        <aside className="p-4 bg-brand-surface-alt/50 border border-brand-border rounded-lg self-start">
          <p>
            <strong>{t("views.assignmentView.dueDate")}:</strong>
          </p>
          <p className="text-red-500 font-semibold">{assignment.dueDate}</p>
        </aside>
      </div>
    </div>
  );
};

export default AssignmentView;
