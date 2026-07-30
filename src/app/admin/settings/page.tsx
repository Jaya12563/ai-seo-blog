import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure your platform settings
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Site Name</Label>
              <Input
                defaultValue="AI SEO Blog"
                className="mt-1 max-w-md"
              />
            </div>
            <div>
              <Label>Site URL</Label>
              <Input
                defaultValue={process.env.NEXTAUTH_URL}
                className="mt-1 max-w-md"
                disabled
              />
            </div>
            <div>
              <Label>Site Description</Label>
              <Input
                defaultValue="AI-Powered SEO Blogging Platform"
                className="mt-1 max-w-md"
              />
            </div>
            <Button>Save Site Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Meta Title</Label>
              <Input
                defaultValue="AI SEO Blog - Create Better Content"
                className="mt-1 max-w-md"
              />
            </div>
            <div>
              <Label>Default Meta Description</Label>
              <Input
                defaultValue="Create, optimize and publish SEO-friendly blogs with AI"
                className="mt-1 max-w-md"
              />
            </div>
            <div>
              <Label>Google Analytics ID</Label>
              <Input
                placeholder="G-XXXXXXXXXX"
                className="mt-1 max-w-md"
              />
            </div>
            <Button>Save SEO Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Model Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default AI Model</Label>
              <Select defaultValue="claude">
                <SelectTrigger className="mt-1 max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude">
                    Claude (Anthropic)
                  </SelectItem>
                  <SelectItem value="gemini">
                    Gemini (Google)
                  </SelectItem>
                  <SelectItem value="openai">
                    GPT-4 (OpenAI)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Max Tokens per Request</Label>
              <Input
                type="number"
                defaultValue="2048"
                className="mt-1 max-w-md"
              />
            </div>
            <Button>Save AI Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}